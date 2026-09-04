import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { CartController } from '../../src/controllers/cart.controller.js';

describe('Cart API Integration Tests', () => {
  let app;
  let mockCartService;

  beforeEach(() => {
    mockCartService = {
      getCart: jest.fn(),
      addItem: jest.fn(),
      updateItemQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const controller = new CartController(mockCartService);
    app = createApp({ cartController: controller });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication & Role Validation', () => {
    it('should return 401 Unauthorized if x-user-id header is missing', async () => {
      const res = await request(app).get('/api/v1/cart');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 403 Forbidden if user role is SELLER or ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/cart')
        .set('x-user-id', 'user-seller-1')
        .set('x-user-role', 'SELLER');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should allow CUSTOMER access to GET /api/v1/cart', async () => {
      const mockCart = {
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [],
        total_items: 0,
        subtotal: '0.00',
      };
      mockCartService.getCart.mockResolvedValue(mockCart);

      const res = await request(app)
        .get('/api/v1/cart')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user_id).toBe('user-cust-1');
      expect(res.body.data.subtotal).toBe('0.00');
    });
  });

  describe('POST /api/v1/cart/items', () => {
    it('should add item and return standardized response envelope', async () => {
      const mockUpdatedCart = {
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [
          {
            id: 'item-1',
            product_id: 'p1a2b3c4-0000-0000-0000-000000000001',
            seller_id: 'seller-1',
            title: 'Test Product',
            price: '50.00',
            quantity: 1,
            subtotal: '50.00',
          },
        ],
        total_items: 1,
        subtotal: '50.00',
      };
      mockCartService.addItem.mockResolvedValue(mockUpdatedCart);

      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({
          productId: 'p1a2b3c4-0000-0000-0000-000000000001',
          quantity: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.subtotal).toBe('50.00');
    });
  });

  describe('PUT /api/v1/cart/items/:id', () => {
    it('should update item quantity', async () => {
      const mockUpdatedCart = {
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [{ id: 'item-1', quantity: 5, subtotal: '250.00' }],
        total_items: 5,
        subtotal: '250.00',
      };
      mockCartService.updateItemQuantity.mockResolvedValue(mockUpdatedCart);

      const res = await request(app)
        .put('/api/v1/cart/items/item-1')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total_items).toBe(5);
    });
  });

  describe('DELETE /api/v1/cart/items/:id and DELETE /api/v1/cart', () => {
    it('should remove specific item', async () => {
      mockCartService.removeItem.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [],
        total_items: 0,
        subtotal: '0.00',
      });

      const res = await request(app)
        .delete('/api/v1/cart/items/item-1')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.data.total_items).toBe(0);
    });

    it('should clear entire cart', async () => {
      mockCartService.clearCart.mockResolvedValue({
        id: null,
        user_id: 'user-cust-1',
        items: [],
        total_items: 0,
        subtotal: '0.00',
      });

      const res = await request(app)
        .delete('/api/v1/cart')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.data.items).toEqual([]);
    });
  });
});
