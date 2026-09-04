import { jest } from '@jest/globals';
import { CartService } from '../../src/services/cart.service.js';
import { ValidationError, NotFoundError, BusinessRuleError } from '@ecommerce/shared';

describe('CartService Unit Tests', () => {
  let cartService;
  let mockCartRepo;
  let mockRedisClient;
  let mockFetch;

  beforeEach(() => {
    mockCartRepo = {
      findByUserId: jest.fn(),
      findOrCreateCart: jest.fn(),
      upsertItemAtomic: jest.fn(),
      updateItemQuantity: jest.fn(),
      deleteItem: jest.fn(),
      clearCart: jest.fn(),
    };

    mockRedisClient = {
      status: 'ready',
      get: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
    };

    cartService = new CartService({
      cartRepo: mockCartRepo,
      getRedis: () => mockRedisClient,
      catalogBaseUrl: 'http://catalog-svc-test',
    });

    // Mock global fetch for catalog-svc calls
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should throw ValidationError if userId is missing', async () => {
      await expect(cartService.getCart(null)).rejects.toThrow(ValidationError);
    });

    it('should return enriched cart using Redis cache hit for structure and live catalog for price', async () => {
      const cachedStructure = {
        cartId: 'cart-1',
        userId: 'user-1',
        items: [
          { id: 'item-1', productId: 'prod-1', sellerId: 'seller-1', quantity: 2 },
        ],
      };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedStructure));

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'prod-1',
            title: 'Wireless Headphones',
            price: '99.50',
            seller_id: 'seller-1',
            is_available: true,
            status: 'PUBLISHED',
          },
        }),
      });

      const result = await cartService.getCart('user-1');

      expect(result.id).toBe('cart-1');
      expect(result.items.length).toBe(1);
      expect(result.items[0].price).toBe('99.50');
      expect(result.items[0].subtotal).toBe('199.00');
      expect(result.subtotal).toBe('199.00');
      expect(result.total_items).toBe(2);
      expect(mockCartRepo.findOrCreateCart).not.toHaveBeenCalled();
    });

    it('should fetch from PostgreSQL on Redis cache miss and populate Redis cache', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const dbCart = {
        id: 'cart-1',
        user_id: 'user-1',
        items: [
          { id: 'item-1', product_id: 'prod-1', seller_id: 'seller-1', quantity: 1 },
        ],
      };
      mockCartRepo.findOrCreateCart.mockResolvedValue(dbCart);

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'prod-1',
            title: 'Wireless Mouse',
            price: '25.00',
            seller_id: 'seller-1',
            is_available: true,
            status: 'PUBLISHED',
          },
        }),
      });

      const result = await cartService.getCart('user-1');

      expect(result.items[0].title).toBe('Wireless Mouse');
      expect(result.subtotal).toBe('25.00');
      expect(mockCartRepo.findOrCreateCart).toHaveBeenCalledWith('user-1');
      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'cart:user-1',
        7 * 24 * 60 * 60,
        expect.any(String),
      );
    });

    it('should fallback to PostgreSQL gracefully when Redis throws an error', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis connection timeout'));
      const dbCart = {
        id: 'cart-1',
        user_id: 'user-1',
        items: [],
      };
      mockCartRepo.findOrCreateCart.mockResolvedValue(dbCart);

      const result = await cartService.getCart('user-1');
      expect(result.items).toEqual([]);
      expect(result.total_items).toBe(0);
      expect(mockCartRepo.findOrCreateCart).toHaveBeenCalledWith('user-1');
    });
  });

  describe('addItem', () => {
    it('should validate product with catalog-svc and atomically upsert in DB', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'prod-1',
            title: 'Mechanical Keyboard',
            price: '120.00',
            seller_id: 'seller-abc',
            is_available: true,
            status: 'PUBLISHED',
          },
        }),
      });

      mockCartRepo.findOrCreateCart.mockResolvedValue({ id: 'cart-1', user_id: 'user-1' });
      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-1',
        items: [
          { id: 'item-1', product_id: 'prod-1', seller_id: 'seller-abc', quantity: 2 },
        ],
      });

      const result = await cartService.addItem({
        userId: 'user-1',
        productId: 'prod-1',
        quantity: 2,
      });

      expect(mockCartRepo.upsertItemAtomic).toHaveBeenCalledWith({
        cartId: 'cart-1',
        productId: 'prod-1',
        sellerId: 'seller-abc',
        quantity: 2,
      });
      expect(mockRedisClient.del).toHaveBeenCalledWith('cart:user-1');
      expect(result.subtotal).toBe('240.00');
    });

    it('should reject adding unpublished or out of stock product', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'prod-1',
            title: 'Draft Phone',
            price: '500.00',
            seller_id: 'seller-abc',
            is_available: false,
            status: 'DRAFT',
          },
        }),
      });

      await expect(
        cartService.addItem({
          userId: 'user-1',
          productId: 'prod-1',
          quantity: 1,
        }),
      ).rejects.toThrow(BusinessRuleError);
      expect(mockCartRepo.upsertItemAtomic).not.toHaveBeenCalled();
    });

    it('should reject invalid quantity outside 1..99 range', async () => {
      await expect(
        cartService.addItem({
          userId: 'user-1',
          productId: 'prod-1',
          quantity: 0,
        }),
      ).rejects.toThrow(ValidationError);

      await expect(
        cartService.addItem({
          userId: 'user-1',
          productId: 'prod-1',
          quantity: 100,
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('updateItemQuantity & removeItem', () => {
    it('should enforce strict ownership when updating item quantity', async () => {
      mockCartRepo.updateItemQuantity.mockResolvedValue(null); // Not found in user's cart

      await expect(
        cartService.updateItemQuantity({
          userId: 'user-1',
          itemId: 'item-foreign',
          quantity: 3,
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should update item and invalidate cache when item belongs to user', async () => {
      mockCartRepo.updateItemQuantity.mockResolvedValue({ id: 'item-1', quantity: 3 });
      mockCartRepo.findByUserId.mockResolvedValue({
        id: 'cart-1',
        user_id: 'user-1',
        items: [
          { id: 'item-1', product_id: 'prod-1', seller_id: 'seller-1', quantity: 3 },
        ],
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { id: 'prod-1', price: '10.00', status: 'PUBLISHED' },
        }),
      });

      const result = await cartService.updateItemQuantity({
        userId: 'user-1',
        itemId: 'item-1',
        quantity: 3,
      });

      expect(mockCartRepo.updateItemQuantity).toHaveBeenCalledWith({
        itemId: 'item-1',
        userId: 'user-1',
        quantity: 3,
      });
      expect(mockRedisClient.del).toHaveBeenCalledWith('cart:user-1');
      expect(result.subtotal).toBe('30.00');
    });

    it('should enforce strict ownership when removing item', async () => {
      mockCartRepo.deleteItem.mockResolvedValue(null);

      await expect(
        cartService.removeItem({
          userId: 'user-1',
          itemId: 'item-foreign',
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('clearCart', () => {
    it('should clear cart in DB and delete Redis cache key', async () => {
      mockCartRepo.clearCart.mockResolvedValue({ id: 'cart-1', user_id: 'user-1', items: [] });

      const result = await cartService.clearCart('user-1');

      expect(mockCartRepo.clearCart).toHaveBeenCalledWith('user-1');
      expect(mockRedisClient.del).toHaveBeenCalledWith('cart:user-1');
      expect(result.items).toEqual([]);
      expect(result.total_items).toBe(0);
    });
  });
});
