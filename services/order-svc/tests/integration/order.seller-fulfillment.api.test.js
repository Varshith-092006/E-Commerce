import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { createOrderRouter } from '../../src/routes/order.routes.js';
import { OrderController } from '../../src/controllers/order.controller.js';
import { OrderService } from '../../src/services/order.service.js';

describe('Seller Order Fulfillment & Shipping Integration Tests', () => {
  let app;
  let mockOrderRepo;
  let orderService;
  let orderController;

  const sellerA = 's1a2b3c4-0000-0000-0000-000000000001';
  const sellerB = 's9a8b7c6-0000-0000-0000-000000000009';
  const customerId = 'u1a2b3c4-0000-0000-0000-000000000001';
  const adminId = 'a1a2b3c4-0000-0000-0000-000000000001';

  const sampleOrder = {
    id: 'ord-500',
    order_number: 'ORD-20260824-A1B2C3',
    user_id: customerId,
    status: 'PLACED',
    payment_method: 'COD',
    total_amount: '120.00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shipping_address: {
      full_name: 'Test Customer',
      phone: '+919876543210',
      street_address: '10 High St',
      city: 'Pune',
      state: 'Maharashtra',
      postal_code: '411001',
      country: 'India',
    },
    items: [
      {
        id: 'item-1',
        product_id: 'prod-1',
        seller_id: sellerA,
        title: 'Ergonomic Desk Chair',
        unit_price: '120.00',
        quantity: 1,
        subtotal: '120.00',
        image_url: null,
        status: 'PLACED',
      },
    ],
  };

  beforeEach(() => {
    mockOrderRepo = {
      findById: jest.fn(),
      findSellerOrders: jest.fn(),
      countSellerOrders: jest.fn(),
      transitionOrderStatusAtomic: jest.fn(),
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

    // Global test error handler
    app.use((err, req, res, _next) => {
      const status =
        err.statusCode ||
        (err.name === 'ForbiddenError'
          ? 403
          : err.name === 'ValidationError' || err.name === 'BusinessRuleError'
          ? 400
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

  describe('GET /api/v1/orders/seller/orders', () => {
    it('should allow Seller A to list orders with seller-scoped items', async () => {
      mockOrderRepo.findSellerOrders.mockResolvedValue([
        {
          ...sampleOrder,
          sellerItems: sampleOrder.items,
          sellerItemsCount: 1,
        },
      ]);
      mockOrderRepo.countSellerOrders.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/orders/seller/orders?status=PLACED&page=1&limit=20')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].orderNumber).toBe('ORD-20260824-A1B2C3');
      expect(res.body.data[0].sellerItems).toHaveLength(1);
    });

    it('should strictly reject CUSTOMER role with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/orders/seller/orders')
        .set('x-user-id', customerId)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/orders/seller/orders/:id/confirm', () => {
    it('should allow Seller to confirm a PLACED order', async () => {
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'CONFIRMED',
          updated_at: new Date().toISOString(),
        },
        alreadyInState: false,
      });

      const res = await request(app)
        .post('/api/v1/orders/seller/orders/ord-500/confirm')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER')
        .send({ reason: 'Stock accepted' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('CONFIRMED');
    });

    it('should reject CUSTOMER role attempting to confirm order with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/orders/seller/orders/ord-500/confirm')
        .set('x-user-id', customerId)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/orders/seller/orders/:id/process', () => {
    it('should allow Seller to mark order as PROCESSING', async () => {
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'PROCESSING',
          updated_at: new Date().toISOString(),
        },
        alreadyInState: false,
      });

      const res = await request(app)
        .post('/api/v1/orders/seller/orders/ord-500/process')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER')
        .send({ reason: 'Packed in box' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('PROCESSING');
    });
  });

  describe('POST /api/v1/orders/seller/orders/:id/ship', () => {
    it('should allow Seller to dispatch order with Courier and AWB Tracking Number', async () => {
      const shippedAt = new Date().toISOString();
      mockOrderRepo.transitionOrderStatusAtomic.mockResolvedValue({
        order: {
          ...sampleOrder,
          status: 'SHIPPED',
          courier_name: 'BlueDart',
          tracking_number: 'BD-8899776655',
          shipped_at: shippedAt,
          updated_at: shippedAt,
        },
        alreadyInState: false,
      });

      const res = await request(app)
        .post('/api/v1/orders/seller/orders/ord-500/ship')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER')
        .send({
          courierName: 'BlueDart',
          trackingNumber: 'BD-8899776655',
          reason: 'Handed to driver',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('SHIPPED');
      expect(res.body.data.courierName).toBe('BlueDart');
      expect(res.body.data.trackingNumber).toBe('BD-8899776655');
    });

    it('should return 422 Unprocessable Entity if trackingNumber is missing or invalid', async () => {
      const res = await request(app)
        .post('/api/v1/orders/seller/orders/ord-500/ship')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER')
        .send({
          courierName: 'BlueDart',
          trackingNumber: '12', // too short (< 6)
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/orders/seller/orders/:id/packing-slip', () => {
    it('should allow Seller to retrieve packing slip for own order', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);

      const res = await request(app)
        .get('/api/v1/orders/seller/orders/ord-500/packing-slip')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER');

      expect(res.status).toBe(200);
      expect(res.body.data.slipNumber).toBe('SLIP-ORD-20260824-A1B2C3');
      expect(res.body.data.sellerItems).toHaveLength(1);
    });

    it('should reject unrelated Seller B with 403 Forbidden', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder); // only sellerA item

      const res = await request(app)
        .get('/api/v1/orders/seller/orders/ord-500/packing-slip')
        .set('x-user-id', sellerB)
        .set('x-user-role', 'SELLER');

      expect(res.status).toBe(403);
    });
  });
});
