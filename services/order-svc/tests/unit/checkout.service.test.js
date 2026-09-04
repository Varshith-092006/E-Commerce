import { jest } from '@jest/globals';
import { CheckoutService } from '../../src/services/checkout.service.js';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  BusinessRuleError,
} from '@ecommerce/shared';

describe('CheckoutService Unit Tests', () => {
  let checkoutService;
  let mockCartRepo;
  let mockFetch;

  beforeEach(() => {
    mockCartRepo = {
      findByUserId: jest.fn(),
    };

    checkoutService = new CheckoutService({
      cartRepo: mockCartRepo,
      catalogBaseUrl: 'http://catalog-svc',
      identityBaseUrl: 'http://identity-svc',
      defaultTaxRate: 0.18,
      freeShippingThreshold: 100.0,
      standardShippingFee: 10.0,
    });

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authoritative Pricing & Anti-Tampering', () => {
    it('should calculate subtotal, tax, shipping, and grand total authoritatively ignoring client prices', async () => {
      // 1. Mock address from identity-svc
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: 'addr-1',
                user_id: 'user-cust-1',
                full_name: 'Alice Smith',
                street_address: '100 Tech Blvd',
                city: 'Austin',
                state: 'TX',
                postal_code: '78701',
                country: 'USA',
              },
            }),
          };
        }
        if (url.includes('/api/v1/products/prod-1')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: 'prod-1',
                seller_id: 'seller-1',
                title: 'Wireless Keyboard',
                price: '50.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        return { ok: false, status: 404 };
      });

      // 2. Persistent cart in order_db has 1 item with quantity 1
      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [{ product_id: 'prod-1', quantity: 1, seller_id: 'seller-1' }],
      });

      const result = await checkoutService.calculateCheckout({
        userId: 'user-cust-1',
        addressId: 'addr-1',
      });

      expect(result.pricing.subtotal).toBe('50.00');
      expect(result.pricing.discount).toBe('0.00');
      expect(result.pricing.taxable_amount).toBe('50.00');
      expect(result.pricing.tax).toBe('9.00'); // 18% of 50.00
      expect(result.pricing.shipping_fee).toBe('10.00'); // Subtotal < 100
      expect(result.pricing.free_shipping).toBe(false);
      expect(result.pricing.grand_total).toBe('69.00'); // 50 + 9 + 10
      expect(result.items[0].price).toBe('50.00');
    });

    it('should grant free shipping when subtotal exceeds $100', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { id: 'addr-1', user_id: 'user-cust-1' },
            }),
          };
        }
        if (url.includes('/api/v1/products/prod-premium')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: 'prod-premium',
                seller_id: 'seller-1',
                title: 'High-End Headphones',
                price: '150.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        return { ok: false, status: 404 };
      });

      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [{ product_id: 'prod-premium', quantity: 1, seller_id: 'seller-1' }],
      });

      const result = await checkoutService.calculateCheckout({
        userId: 'user-cust-1',
        addressId: 'addr-1',
      });

      expect(result.pricing.subtotal).toBe('150.00');
      expect(result.pricing.shipping_fee).toBe('0.00');
      expect(result.pricing.free_shipping).toBe(true);
      expect(result.pricing.tax).toBe('27.00'); // 18% of 150
      expect(result.pricing.grand_total).toBe('177.00'); // 150 + 27 + 0
    });
  });

  describe('Coupon Validation Integration', () => {
    it('should apply valid coupon discount and compute tax on net taxable amount', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { id: 'addr-1', user_id: 'user-cust-1' },
            }),
          };
        }
        if (url.includes('/api/v1/products/prod-1')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: 'prod-1',
                seller_id: 'seller-1',
                title: 'Item A',
                price: '100.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        if (url.includes('/api/v1/coupons/validate')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                valid: true,
                code: 'SAVE20',
                discount_type: 'PERCENTAGE',
                discount_value: '20.00',
                discount_amount: '20.00',
                message: 'Coupon applied',
              },
            }),
          };
        }
        return { ok: false, status: 404 };
      });

      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [{ product_id: 'prod-1', quantity: 1, seller_id: 'seller-1' }],
      });

      const result = await checkoutService.calculateCheckout({
        userId: 'user-cust-1',
        addressId: 'addr-1',
        couponCode: 'SAVE20',
      });

      expect(result.pricing.subtotal).toBe('100.00');
      expect(result.pricing.discount).toBe('20.00');
      expect(result.pricing.taxable_amount).toBe('80.00'); // 100 - 20
      expect(result.pricing.tax).toBe('14.40'); // 18% of 80
      expect(result.pricing.shipping_fee).toBe('0.00'); // Subtotal was 100
      expect(result.pricing.grand_total).toBe('94.40'); // 80 + 14.40
    });
  });

  describe('Security & Address Ownership Validation', () => {
    it('should reject address belonging to another customer with ForbiddenError', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: 'addr-other',
                user_id: 'user-victim-2', // Belongs to different customer!
              },
            }),
          };
        }
        return { ok: false };
      });

      await expect(
        checkoutService.calculateCheckout({
          userId: 'user-attacker-1',
          addressId: 'addr-other',
        }),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Buy Now Direct Path', () => {
    it('should calculate Buy Now single item without modifying or loading persistent cart', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { id: 'addr-1', user_id: 'user-cust-1' },
            }),
          };
        }
        if (url.includes('/api/v1/products/prod-instant')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: 'prod-instant',
                seller_id: 'seller-instant',
                title: 'Instant Buy Item',
                price: '75.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        return { ok: false };
      });

      const result = await checkoutService.calculateCheckout({
        userId: 'user-cust-1',
        addressId: 'addr-1',
        buyNowItem: { productId: 'prod-instant', quantity: 2 },
      });

      expect(result.is_buy_now).toBe(true);
      expect(result.pricing.subtotal).toBe('150.00'); // 75 * 2
      expect(mockCartRepo.findByUserId).not.toHaveBeenCalled(); // Persistent cart untouched!
    });
  });

  describe('Business Rule Rejections', () => {
    it('should reject checkout when cart is empty', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { id: 'addr-1', user_id: 'user-cust-1' },
        }),
      });

      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [],
      });

      await expect(
        checkoutService.calculateCheckout({
          userId: 'user-cust-1',
          addressId: 'addr-1',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });

    it('should reject checkout when product is out of stock', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { id: 'addr-1', user_id: 'user-cust-1' },
            }),
          };
        }
        if (url.includes('/api/v1/products/prod-1')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: 'prod-1',
                title: 'Out of stock item',
                price: '50.00',
                status: 'PUBLISHED',
                is_available: false, // Out of stock!
              },
            }),
          };
        }
        return { ok: false };
      });

      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-cust-1',
        items: [{ product_id: 'prod-1', quantity: 1, seller_id: 'seller-1' }],
      });

      await expect(
        checkoutService.calculateCheckout({
          userId: 'user-cust-1',
          addressId: 'addr-1',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });
  });
});
