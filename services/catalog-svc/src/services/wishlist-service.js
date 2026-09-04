import { getRedisClient, isRedisReady, logger } from '@ecommerce/shared';

import { WishlistRepository } from '../repositories/wishlist-repository.js';

const WISHLIST_CACHE_TTL_SECONDS = 3600; // 1 hour

export class WishlistService {
  constructor({ wishlistRepo = new WishlistRepository(), redisClient = null } = {}) {
    this.wishlistRepo = wishlistRepo;
    this.redisClient = redisClient;
  }

  getRedis() {
    if (this.redisClient) {
      return this.redisClient;
    }
    try {
      return getRedisClient();
    } catch {
      return null;
    }
  }

  async getWishlist(userId) {
    const cacheKey = `wishlist:${userId}`;
    const redis = this.getRedis();

    // 1. Try reading from Redis Cache
    if (redis && isRedisReady(redis)) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (err) {
        logger.warn(
          { err: err.message, userId },
          'Redis wishlist cache read failed - falling back to PostgreSQL',
        );
      }
    }

    // 2. Fetch from durable PostgreSQL source of truth
    const items = await this.wishlistRepo.findByUserId(userId);

    // 3. Populate Redis Cache asynchronously if Redis is online
    if (redis && isRedisReady(redis)) {
      try {
        await redis.set(cacheKey, JSON.stringify(items), 'EX', WISHLIST_CACHE_TTL_SECONDS);
      } catch (err) {
        logger.warn({ err: err.message, userId }, 'Redis wishlist cache write failed');
      }
    }

    return items;
  }

  async addToWishlist(userId, productId) {
    const item = await this.wishlistRepo.addItem(userId, productId);

    // Invalidate Redis cache
    const redis = this.getRedis();
    if (redis && isRedisReady(redis)) {
      try {
        await redis.del(`wishlist:${userId}`);
      } catch (err) {
        logger.warn({ err: err.message, userId }, 'Redis wishlist cache invalidation failed');
      }
    }

    return item;
  }

  async removeFromWishlist(userId, productId) {
    const removed = await this.wishlistRepo.removeItem(userId, productId);

    // Invalidate Redis cache
    const redis = this.getRedis();
    if (redis && isRedisReady(redis)) {
      try {
        await redis.del(`wishlist:${userId}`);
      } catch (err) {
        logger.warn({ err: err.message, userId }, 'Redis wishlist cache invalidation failed');
      }
    }

    return removed;
  }
}
