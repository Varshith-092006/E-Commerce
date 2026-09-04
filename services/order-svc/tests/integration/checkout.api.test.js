import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { CheckoutController } from '../../src/controllers/checkout.controller.js';

describe('Checkout API Integration Tests', () => {
  let app;
  let mockCheckoutService;

  beforeEach(() => {
    mockCheckoutService = {
      calculateCheckout: jest.fn(),
    };

    const controller = new CheckoutController(mockCheckoutService);
    app = createApp({ checkoutController: controller });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication & Role Validation', () => {
    it('should return 401 Unauthorized if x-user-id header is missing', async () => {
      const res = await request(app)
        .post('/api/v1/checkout/calculate')
        .send({ addressId: 'a1a2b3c4-0000-0000-0000-000000000001' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 403 Forbidden if user role is SELLER or ADMIN', async () => {
      const res = await request(app)
        .post('/api/v1/checkout/calculate')
        .set('x-user-id', 'user-seller-1')
        .set('x-user-role', 'SELLER')
        .send({ addressId: 'a1a2b3c4-0000-0000-0000-000000000001' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('POST /api/v1/checkout/calculate', () => {
    it('should reject when both useCart and buyNowItem are provided simultaneously', async () => {
      const res = await request(app)
        .post('/api/v1/checkout/calculate')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({
          addressId: 'a1a2b3c4-0000-0000-0000-000000000001',
          useCart: true,
          buyNowItem: { productId: 'p1', quantity: 1 },
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should calculate checkout successfully for customer', async () => {
      const mockSummary = {
        items: [
          {
            product_id: 'prod-1',
            seller_id: 'seller-1',
            title: 'Mechanical Keyboard',
            price: '100.00',
            quantity: 1,
            subtotal: '100.00',
          },
        ],
        address: {
          id: 'addr-1',
          full_name: 'John Doe',
        },
        pricing: {
          subtotal: '100.00',
          discount: '0.00',
          taxable_amount: '100.00',
          tax_rate: '0.18',
          tax: '18.00',
          shipping_fee: '0.00',
          free_shipping: true,
          grand_total: '118.00',
        },
        is_buy_now: false,
      };
      mockCheckoutService.calculateCheckout.mockResolvedValue(mockSummary);

      const res = await request(app)
        .post('/api/v1/checkout/calculate')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({
          addressId: 'addr-1',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pricing.grand_total).toBe('118.00');
      expect(res.body.data.pricing.tax).toBe('18.00');
    });
  });
});
