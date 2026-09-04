import { jest } from '@jest/globals';
import { WishlistService } from '../../src/services/wishlist-service.js';

describe('WishlistService Unit Tests', () => {
  let wishlistService;
  let mockWishlistRepo;
  let mockRedisClient;

  beforeEach(() => {
    mockWishlistRepo = {
      findByUserId: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
    };
    mockRedisClient = {
      status: 'ready',
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    wishlistService = new WishlistService({
      wishlistRepo: mockWishlistRepo,
      redisClient: mockRedisClient,
    });
  });

  describe('getWishlist', () => {
    it('should return cached items when Redis cache hit occurs', async () => {
      const cachedData = [{ id: 'item-1', product_id: 'prod-1' }];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await wishlistService.getWishlist('user-1');
      expect(result).toEqual(cachedData);
      expect(mockWishlistRepo.findByUserId).not.toHaveBeenCalled();
    });

    it('should fetch from PostgreSQL source of truth on Redis cache miss and populate cache', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const dbData = [{ id: 'item-1', product_id: 'prod-1' }];
      mockWishlistRepo.findByUserId.mockResolvedValue(dbData);

      const result = await wishlistService.getWishlist('user-1');
      expect(result).toEqual(dbData);
      expect(mockWishlistRepo.findByUserId).toHaveBeenCalledWith('user-1');
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'wishlist:user-1',
        JSON.stringify(dbData),
        'EX',
        3600,
      );
    });

    it('should fallback to PostgreSQL gracefully when Redis is down/errors', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis connection refused'));
      const dbData = [{ id: 'item-1', product_id: 'prod-1' }];
      mockWishlistRepo.findByUserId.mockResolvedValue(dbData);

      const result = await wishlistService.getWishlist('user-1');
      expect(result).toEqual(dbData);
      expect(mockWishlistRepo.findByUserId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('addToWishlist & removeFromWishlist', () => {
    it('should write to PostgreSQL and invalidate Redis cache upon adding item', async () => {
      mockWishlistRepo.addItem.mockResolvedValue({ id: 'item-1' });

      await wishlistService.addToWishlist('user-1', 'prod-1');
      expect(mockWishlistRepo.addItem).toHaveBeenCalledWith('user-1', 'prod-1');
      expect(mockRedisClient.del).toHaveBeenCalledWith('wishlist:user-1');
    });

    it('should delete from PostgreSQL and invalidate Redis cache upon removing item', async () => {
      mockWishlistRepo.removeItem.mockResolvedValue({ id: 'item-1' });

      await wishlistService.removeFromWishlist('user-1', 'prod-1');
      expect(mockWishlistRepo.removeItem).toHaveBeenCalledWith('user-1', 'prod-1');
      expect(mockRedisClient.del).toHaveBeenCalledWith('wishlist:user-1');
    });
  });
});
