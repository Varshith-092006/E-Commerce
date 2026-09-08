import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { SecurityHeaders } from '@ecommerce/shared';
import { createOrderRouter } from '../../src/routes/order.routes.js';
import { OrderController } from '../../src/controllers/order.controller.js';
import { OrderService } from '../../src/services/order.service.js';

describe('Order Query, Authorization, Search & Invoicing Integration Tests', () => {
  let app;
  let mockOrderRepo;
  let orderService;
  let orderController;

  const customerA = 'u1a2b3c4-0000-0000-0000-000000000001';
  const customerB = 'u9a8b7c6-0000-0000-0000-000000000009';
  const sellerA = 's1a2b3c4-0000-0000-0000-000000000001';
  const sellerB = 's9a8b7c6-0000-0000-0000-000000000009';
  const adminId = 'a1a2b3c4-0000-0000-0000-000000000001';

  const sampleOrder = {
    id: 'ord-100',
    order_number: 'ORD-20260824-A1B2C3',
    user_id: customerA,
    status: 'PLACED',
    payment_method: 'PREPAID',
    payment_id: 'pay-100',
    total_amount: '118.00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shipping_address: {
      full_name: 'Customer One',
      phone: '+919876543210',
      street_address: '123 Tech Way',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560001',
      country: 'India',
    },
    pricing_snapshot: {
      subtotal: '100.00',
      tax: '18.00',
      shipping_fee: '0.00',
      grand_total: '118.00',
    },
    items: [
      {
        id: 'item-100',
        product_id: 'prod-1',
        seller_id: sellerA,
        title: 'Gaming Mouse',
        unit_price: '100.00',
        quantity: 1,
        subtotal: '100.00',
        image_url: null,
        status: 'PLACED',
      },
    ],
    status_history: [
      {
        id: 'h-1',
        from_status: null,
        to_status: 'PLACED',
        changed_by: customerA,
        actor_role: 'CUSTOMER',
        reason: 'ORDER_PLACED',
        created_at: new Date().toISOString(),
      },
    ],
  };

  beforeEach(() => {
    mockOrderRepo = {
      findById: jest.fn(),
      findOrders: jest.fn(),
      countOrders: jest.fn(),
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
      const status = err.statusCode || (err.name === 'ForbiddenError' ? 403 : err.name === 'ValidationError' ? 400 : 500);
      res.status(status).json({
        success: false,
        error: { message: err.message, code: err.code || 'ERROR' },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/orders (Advanced Query, Filters & Search)', () => {
    it('should query orders with status filter and search query without calling payment-svc', async () => {
      mockOrderRepo.findOrders.mockResolvedValue([sampleOrder]);
      mockOrderRepo.countOrders.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/orders?status=PLACED,CONFIRMED&search=Mouse&page=1&limit=10')
        .set('x-user-id', customerA)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].orderNumber).toBe('ORD-20260824-A1B2C3');
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(mockOrderRepo.findOrders).toHaveBeenCalledWith({
        userId: customerA,
        userRole: 'CUSTOMER',
        statuses: ['PLACED', 'CONFIRMED'],
        search: 'Mouse',
        skip: 0,
        take: 10,
      });
    });

    it('should clamp limit to standardized max 100 and sanitize invalid page numbers', async () => {
      mockOrderRepo.findOrders.mockResolvedValue([]);
      mockOrderRepo.countOrders.mockResolvedValue(0);

      const res = await request(app)
        .get('/api/v1/orders?page=-5&limit=500')
        .set('x-user-id', customerA)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(mockOrderRepo.findOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 100,
        }),
      );
    });
  });

  describe('GET /api/v1/orders/:id (Multi-Role Authorization & Detail Payload)', () => {
    it('should allow Customer A to view own order', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue({
        status: 'CAPTURED',
        amount: '118.00',
      });

      const res = await request(app)
        .get('/api/v1/orders/ord-100')
        .set('x-user-id', customerA)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.data.orderNumber).toBe('ORD-20260824-A1B2C3');
      expect(res.body.data.tracking.currentStep).toBe(0);
      expect(res.body.data.paymentDetails.status).toBe('CAPTURED');
    });

    it('should reject Customer B viewing Customer A order with 403 Forbidden', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);

      const res = await request(app)
        .get('/api/v1/orders/ord-100')
        .set('x-user-id', customerB)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(403);
    });

    it('should allow Seller A to view order containing Seller A item', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/orders/ord-100')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('ord-100');
    });

    it('should reject unrelated Seller B with 403 Forbidden', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);

      const res = await request(app)
        .get('/api/v1/orders/ord-100')
        .set('x-user-id', sellerB)
        .set('x-user-role', 'SELLER');

      expect(res.status).toBe(403);
    });

    it('should allow Admin to view any order', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/orders/ord-100')
        .set('x-user-id', adminId)
        .set('x-user-role', 'ADMIN');

      expect(res.status).toBe(200);
    });

    it('should gracefully return paymentDetails: null when payment-svc fails', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/orders/ord-100')
        .set('x-user-id', customerA)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.data.paymentDetails).toBeNull();
    });
  });

  describe('GET /api/v1/orders/:id/invoice (Tax Invoice Authorization)', () => {
    it('should allow owning customer to retrieve tax invoice', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue({ status: 'CAPTURED' });

      const res = await request(app)
        .get('/api/v1/orders/ord-100/invoice')
        .set('x-user-id', customerA)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.data.invoiceNumber).toBe('INV-ORD-20260824-A1B2C3');
      expect(res.body.data.paymentStatus).toBe('PAID');
    });

    it('should reject unauthorized customer for tax invoice with 403 Forbidden', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);

      const res = await request(app)
        .get('/api/v1/orders/ord-100/invoice')
        .set('x-user-id', customerB)
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(403);
    });

    it('should strictly reject Seller for tax invoice with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/orders/ord-100/invoice')
        .set('x-user-id', sellerA)
        .set('x-user-role', 'SELLER');

      expect(res.status).toBe(403);
    });

    it('should allow Admin to retrieve tax invoice for any order', async () => {
      mockOrderRepo.findById.mockResolvedValue(sampleOrder);
      jest.spyOn(orderService, '_fetchPaymentStatus').mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/orders/ord-100/invoice')
        .set('x-user-id', adminId)
        .set('x-user-role', 'ADMIN');

      expect(res.status).toBe(200);
      expect(res.body.data.invoiceNumber).toBe('INV-ORD-20260824-A1B2C3');
    });
  });
});
