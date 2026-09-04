import { jest } from '@jest/globals';
import { OrderService } from '../../src/services/order.service.js';
import {
  ValidationError,
  ConflictError,
  ForbiddenError,
  BusinessRuleError,
} from '@ecommerce/shared';

describe('OrderService Unit Tests', () => {
  let orderService;
  let mockOrderRepo;
  let mockIdempotencyRepo;
  let mockCartRepo;
  let mockRedisClient;
  let mockFetch;

  const validKey = 'idem-key-1234567890abcdef';
  const userId = 'u1a2b3c4-0000-0000-0000-000000000001';
  const addressId = 'a1a2b3c4-0000-0000-0000-000000000001';
  const paymentId = 'p1a2b3c4-0000-0000-0000-000000000001';

  beforeEach(() => {
    mockOrderRepo = {
      createOrderAtomic: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      countByUserId: jest.fn(),
    };

    mockIdempotencyRepo = {
      findByKey: jest.fn().mockResolvedValue(null),
      createRecord: jest.fn().mockResolvedValue({ id: 'rec-1' }),
      markCompleted: jest.fn().mockResolvedValue({ id: 'rec-1' }),
      markFailed: jest.fn().mockResolvedValue(true),
    };

    mockCartRepo = {
      findByUserId: jest.fn(),
    };

    mockRedisClient = {
      status: 'ready',
      get: jest.fn(),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn(),
    };

    orderService = new OrderService({
      orderRepo: mockOrderRepo,
      idempotencyRepo: mockIdempotencyRepo,
      cartRepo: mockCartRepo,
      getRedis: () => mockRedisClient,
      catalogBaseUrl: 'http://catalog-svc',
      identityBaseUrl: 'http://identity-svc',
      paymentBaseUrl: 'http://payment-svc',
      defaultTaxRate: 0.18,
    });

    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Idempotency Validation & Replay', () => {
    it('should reject missing or short Idempotency-Key header', async () => {
      await expect(
        orderService.createOrder({
          userId,
          idempotencyKey: 'short-key',
          addressId,
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should return cached order response when identical key was already completed', async () => {
      const cachedOrder = {
        id: 'ord-1',
        order_number: 'ORD-123',
        status: 'PLACED',
        total_amount: '118.00',
      };
      const expectedHash = orderService.computeRequestHash({
        addressId,
        paymentMethod: 'COD',
        paymentId: null,
        couponCode: null,
        buyNowItem: null,
        customerNotes: null,
      });

      mockIdempotencyRepo.findByKey.mockResolvedValue({
        status: 'COMPLETED',
        request_hash: expectedHash,
        response_payload: cachedOrder,
      });

      const result = await orderService.createOrder({
        userId,
        idempotencyKey: validKey,
        addressId,
        paymentMethod: 'COD',
      });

      expect(result.isReplay).toBe(true);
      expect(result.order.id).toBe('ord-1');
      expect(mockOrderRepo.createOrderAtomic).not.toHaveBeenCalled();
    });

    it('should throw ConflictError (IDEMPOTENCY_KEY_REUSED) when same key is used with different payload', async () => {
      mockIdempotencyRepo.findByKey.mockResolvedValue({
        status: 'COMPLETED',
        request_hash: 'different_hash_value_123',
        response_payload: { id: 'ord-1' },
      });

      await expect(
        orderService.createOrder({
          userId,
          idempotencyKey: validKey,
          addressId,
          paymentMethod: 'COD',
        }),
      ).rejects.toThrow(ConflictError);
    });

    it('should throw ConflictError (IDEMPOTENCY_CONFLICT) when same key is currently IN_PROGRESS', async () => {
      const expectedHash = orderService.computeRequestHash({
        addressId,
        paymentMethod: 'COD',
        paymentId: null,
        couponCode: null,
        buyNowItem: null,
        customerNotes: null,
      });

      mockIdempotencyRepo.findByKey.mockResolvedValue({
        status: 'IN_PROGRESS',
        request_hash: expectedHash,
      });

      await expect(
        orderService.createOrder({
          userId,
          idempotencyKey: validKey,
          addressId,
          paymentMethod: 'COD',
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('Prepaid & COD Order Placement', () => {
    it('should successfully place a COD order, compute 18% tax and persist OrderOutbox', async () => {
      // Mock identity-svc address
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: addressId,
                user_id: userId,
                full_name: 'John Doe',
                phone: '1234567890',
                street_address: '10 Main St',
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
                title: 'Bluetooth Speaker',
                price: '100.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        return { ok: false };
      });

      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: userId,
        items: [{ product_id: 'prod-1', quantity: 1, seller_id: 'seller-1' }],
      });

      mockOrderRepo.createOrderAtomic.mockResolvedValue({
        id: 'ord-cod-1',
        order_number: 'ORD-20260824-COD123',
        status: 'PLACED',
        payment_method: 'COD',
        total_amount: '118.00', // 100 + 18 tax + 0 shipping (threshold >= 100)
        items: [
          {
            id: 'oi-1',
            product_id: 'prod-1',
            seller_id: 'seller-1',
            title: 'Bluetooth Speaker',
            unit_price: '100.00',
            quantity: 1,
            subtotal: '100.00',
          },
        ],
      });

      const result = await orderService.createOrder({
        userId,
        idempotencyKey: validKey,
        addressId,
        paymentMethod: 'COD',
      });

      expect(result.isReplay).toBe(false);
      expect(result.order.status).toBe('PLACED');
      expect(result.order.payment_method).toBe('COD');
      expect(mockOrderRepo.createOrderAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          clearCartUserId: userId,
          orderData: expect.objectContaining({
            payment_method: 'COD',
            total_amount: '118.00',
          }),
        }),
      );
    });

    it('should verify payment authorization with payment-svc for PREPAID orders', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { id: addressId, user_id: userId },
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
                price: '50.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        if (url.includes('/api/v1/payments/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: paymentId,
                user_id: userId,
                amount: '69.00', // 50 + 9 tax + 10 shipping = 69.00
                status: 'AUTHORIZED',
              },
            }),
          };
        }
        return { ok: false };
      });

      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: userId,
        items: [{ product_id: 'prod-1', quantity: 1, seller_id: 'seller-1' }],
      });

      mockOrderRepo.createOrderAtomic.mockResolvedValue({
        id: 'ord-prepaid-1',
        status: 'PLACED',
        payment_method: 'PREPAID',
        payment_id: paymentId,
        total_amount: '69.00',
        items: [],
      });

      const result = await orderService.createOrder({
        userId,
        idempotencyKey: validKey,
        addressId,
        paymentMethod: 'PREPAID',
        paymentId,
      });

      expect(result.order.payment_method).toBe('PREPAID');
      expect(result.order.total_amount).toBe('69.00');
    });

    it('should reject PREPAID order if payment amount does not match authoritative calculated order amount', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { id: addressId, user_id: userId },
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
                price: '50.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        if (url.includes('/api/v1/payments/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                id: paymentId,
                user_id: userId,
                amount: '10.00', // Mismatch! Target is 69.00
                status: 'AUTHORIZED',
              },
            }),
          };
        }
        return { ok: false };
      });

      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: userId,
        items: [{ product_id: 'prod-1', quantity: 1, seller_id: 'seller-1' }],
      });

      await expect(
        orderService.createOrder({
          userId,
          idempotencyKey: validKey,
          addressId,
          paymentMethod: 'PREPAID',
          paymentId,
        }),
      ).rejects.toThrow(BusinessRuleError);

      expect(mockIdempotencyRepo.markFailed).toHaveBeenCalledWith({
        userId,
        idempotencyKey: validKey,
      });
    });
  });

  describe('Buy Now Order Placement', () => {
    it('should create Buy Now order without modifying persistent cart', async () => {
      mockFetch.mockImplementation(async (url) => {
        if (url.includes('/api/v1/users/addresses/')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { id: addressId, user_id: userId },
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
                title: 'Direct Item',
                price: '100.00',
                status: 'PUBLISHED',
                is_available: true,
              },
            }),
          };
        }
        return { ok: false };
      });

      mockOrderRepo.createOrderAtomic.mockResolvedValue({
        id: 'ord-buynow-1',
        status: 'PLACED',
        payment_method: 'COD',
        total_amount: '118.00',
        items: [],
      });

      const result = await orderService.createOrder({
        userId,
        idempotencyKey: validKey,
        addressId,
        paymentMethod: 'COD',
        buyNowItem: { productId: 'prod-instant', quantity: 1 },
      });

      expect(result.order.id).toBe('ord-buynow-1');
      expect(mockCartRepo.findByUserId).not.toHaveBeenCalled();
      expect(mockOrderRepo.createOrderAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          clearCartUserId: null, // Persistent cart untouched!
        }),
      );
    });
  });
});
