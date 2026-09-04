import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { OrderController } from '../../src/controllers/order.controller.js';

describe('Order API Integration Tests', () => {
  let app;
  let mockOrderService;

  beforeEach(() => {
    mockOrderService = {
      createOrder: jest.fn(),
      getOrderById: jest.fn(),
      getCustomerOrders: jest.fn(),
    };

    const controller = new OrderController(mockOrderService);
    app = createApp({ orderController: controller });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication & Idempotency Key Validation', () => {
    it('should return 401 Unauthorized if x-user-id header is missing', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('idempotency-key', 'valid-key-1234567890abcdef')
        .send({ addressId: 'addr-1', paymentMethod: 'COD' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 403 Forbidden if user role is SELLER', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('x-user-id', 'user-seller-1')
        .set('x-user-role', 'SELLER')
        .set('idempotency-key', 'valid-key-1234567890abcdef')
        .send({ addressId: 'addr-1', paymentMethod: 'COD' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('POST /api/v1/orders', () => {
    it('should create order and return 201 Created', async () => {
      const mockCreatedOrder = {
        id: 'ord-1',
        order_number: 'ORD-20260824-001',
        status: 'PLACED',
        payment_method: 'COD',
        total_amount: '118.00',
        items: [
          {
            id: 'oi-1',
            product_id: 'prod-1',
            seller_id: 'seller-1',
            title: 'Mechanical Keyboard',
            unit_price: '100.00',
            quantity: 1,
            subtotal: '100.00',
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue({
        order: mockCreatedOrder,
        isReplay: false,
      });

      const res = await request(app)
        .post('/api/v1/orders')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .set('idempotency-key', 'valid-key-1234567890abcdef')
        .send({
          addressId: 'addr-1',
          paymentMethod: 'COD',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('ord-1');
      expect(res.headers['x-idempotent-replay']).toBeUndefined();
    });

    it('should set x-idempotent-replay header when replaying an existing order', async () => {
      const mockCachedOrder = {
        id: 'ord-1',
        order_number: 'ORD-20260824-001',
        status: 'PLACED',
        total_amount: '118.00',
      };

      mockOrderService.createOrder.mockResolvedValue({
        order: mockCachedOrder,
        isReplay: true,
      });

      const res = await request(app)
        .post('/api/v1/orders')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .set('idempotency-key', 'valid-key-1234567890abcdef')
        .send({
          addressId: 'addr-1',
          paymentMethod: 'COD',
        });

      expect(res.status).toBe(201);
      expect(res.headers['x-idempotent-replay']).toBe('true');
      expect(res.body.data.id).toBe('ord-1');
    });
  });

  describe('GET /api/v1/orders and GET /api/v1/orders/:id', () => {
    it('should return list of customer orders', async () => {
      mockOrderService.getCustomerOrders.mockResolvedValue({
        items: [{ id: 'ord-1', status: 'PLACED' }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const res = await request(app)
        .get('/api/v1/orders')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('should return single order by ID', async () => {
      mockOrderService.getOrderById.mockResolvedValue({
        id: 'ord-1',
        order_number: 'ORD-123',
        status: 'PLACED',
      });

      const res = await request(app)
        .get('/api/v1/orders/ord-1')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('ord-1');
    });
  });
});
