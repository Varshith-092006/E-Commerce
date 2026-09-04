import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { createOrderRouter } from '../../src/routes/order.routes.js';
import { OrderController } from '../../src/controllers/order.controller.js';
import { OrderService } from '../../src/services/order.service.js';

describe('Logistics & Last-Mile Delivery API Integration Tests', () => {
  let app;
  let mockOrderRepo;
  let orderService;
  let orderController;

  const courierId = 'c1a2b3c4-0000-0000-0000-000000000001';
  const customerId = 'u1a2b3c4-0000-0000-0000-000000000001';
  const sellerId = 's1a2b3c4-0000-0000-0000-000000000001';

  const sampleOrder = {
    id: 'ord-800',
    order_number: 'ORD-20260824-A1B2C3',
    user_id: customerId,
    status: 'SHIPPED',
    payment_method: 'COD',
    total_amount: '118.00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shipping_address: {
      full_name: 'Jane Customer',
      phone: '+919876543210',
      street_address: '15 Delivery Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400001',
    },
    items: [],
  };

  beforeEach(() => {
    mockOrderRepo = {
      findById: jest.fn(),
      findLogisticsOrders: jest.fn(),
      countLogisticsOrders: jest.fn(),
      transitionOrderStatusAtomic: jest.fn(),
      recordDeliveryAttemptAtomic: jest.fn(),
    };

    orderService = new OrderService({
      orderRepo: mockOrderRepo,
      paymentBaseUrl: 'http://localhost:4004',
      internalSecret: 'test-secret',
    });

    orderController = new OrderController(orderService);

    app = express();
    app.use(express.json());
    app.use('/api/v1/orders', createOrderRouter({ controller: orderController }));

    // Error handler
    app.use((err, req, res, _next) => {
      const status =
        err.statusCode ||
        (err.name === 'ForbiddenError'
          ? 403
          : err.name === 'ValidationError' || err.name === 'BusinessRuleError'
          ? 422
          : err.name === 'NotFoundError'
          ? 404
          : 500);
      res.status(status).json({
        success: false,
        error: { message: err.message, code: err.code || 'ERROR' },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/orders/logistics/orders', () => {
    it('should allow COURIER role to query run sheet', async () => {
      mockOrderRepo.findLogisticsOrders.mockResolvedValue([sampleOrder]);
      mockOrderRepo.countLogisticsOrders.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/orders/logistics/orders?status=SHIPPED&page=1&limit=20')
        .set('x-user-id', courierId)
        .set('x-user-role', 'COURIER');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('should reject CUSTOMER and SELLER roles with 403 Forbidden', async () => {
      const resCustomer = await request(app)
        .get('/api/v1/orders/logistics/orders')
        .set('x-user-id', customerId)
        .set('x-user-role', 'CUSTOMER');

      expect(resCustomer.status).toBe(403);

      const resSeller = await request(app)
        .get('/api/v1/orders/logistics/orders')
        .set('x-user-id', sellerId)
        .set('x-user-role', 'SELLER');

      expect(resSeller.status).toBe(403);
    });
  });

  describe('POST /api/v1/orders/logistics/orders/:id/out-for-delivery', () => {
    it('should allow COURIER to mark order OUT_FOR_DELIVERY', async () => {
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'OUT_FOR_DELIVERY',
          delivery_agent_name: 'Ramesh Kumar',
          delivery_agent_phone: '+919876543210',
          updated_at: new Date().toISOString(),
        },
        alreadyInState: false,
      });

      const res = await request(app)
        .post('/api/v1/orders/logistics/orders/ord-800/out-for-delivery')
        .set('x-user-id', courierId)
        .set('x-user-role', 'COURIER')
        .send({
          deliveryAgentName: 'Ramesh Kumar',
          deliveryAgentPhone: '+919876543210',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('OUT_FOR_DELIVERY');
      expect(res.body.data.deliveryAgentName).toBe('Ramesh Kumar');
    });

    it('should reject CUSTOMER attempting out-for-delivery with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/orders/logistics/orders/ord-800/out-for-delivery')
        .set('x-user-id', customerId)
        .set('x-user-role', 'CUSTOMER')
        .send({
          deliveryAgentName: 'Ramesh Kumar',
          deliveryAgentPhone: '+919876543210',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/orders/logistics/orders/:id/deliver', () => {
    it('should allow COURIER to mark order DELIVERED with valid POD', async () => {
      const deliveredAt = new Date().toISOString();
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'DELIVERED',
          delivered_at: deliveredAt,
          pod_metadata: {
            recipientName: 'Jane Customer',
            podReference: 'OTP-4921',
          },
        },
        alreadyInState: false,
      });

      const res = await request(app)
        .post('/api/v1/orders/logistics/orders/ord-800/deliver')
        .set('x-user-id', courierId)
        .set('x-user-role', 'COURIER')
        .send({
          recipientName: 'Jane Customer',
          podReference: 'OTP-4921',
          deliveryNotes: 'Handed at front entrance',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('DELIVERED');
      expect(res.body.data.podMetadata.recipientName).toBe('Jane Customer');
    });

    it('should return 422 if recipientName or podReference is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/orders/logistics/orders/ord-800/deliver')
        .set('x-user-id', courierId)
        .set('x-user-role', 'COURIER')
        .send({
          recipientName: 'J', // too short (< 2)
          podReference: 'OTP-4921',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/orders/logistics/orders/:id/attempt-failed', () => {
    it('should allow COURIER to record failed delivery attempt', async () => {
      mockOrderRepo.recordDeliveryAttemptAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'OUT_FOR_DELIVERY',
          delivery_attempts: 1,
          updated_at: new Date().toISOString(),
        },
        historyEntry: { id: 'hist-1' },
      });

      const res = await request(app)
        .post('/api/v1/orders/logistics/orders/ord-800/attempt-failed')
        .set('x-user-id', courierId)
        .set('x-user-role', 'COURIER')
        .send({
          reason: 'Customer premises locked / Door closed. Rescheduled.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('OUT_FOR_DELIVERY');
      expect(res.body.data.deliveryAttempts).toBe(1);
    });
  });
});
