import { v4 as uuidv4 } from 'uuid';
import { getRedisClient, CacheService, CacheKeys } from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';
import { config } from '../config/index.js';

export class ReviewRepository {
  constructor(prismaClient = defaultPrisma, cacheService = null) {
    this.prisma = prismaClient;
    if (cacheService) {
      this.cache = cacheService;
    } else {
      try {
        const redis = config.redisUrl ? getRedisClient(config.redisUrl) : null;
        this.cache = new CacheService({
          redisClient: redis,
          enabled: config.cache?.enabled !== false,
          defaultNamespace: 'review',
          defaultTtl: config.cache?.reviewTtl || 120,
        });
      } catch {
        this.cache = new CacheService({ redisClient: null, enabled: false });
      }
    }
  }

  /**
   * Creates a review and appends an event to CatalogOutbox within an atomic transaction
   */
  async createWithOutbox({ productId, userId, rating, title, comment }) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Verify product exists
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });

      if (!product) {
        const error = new Error(`Product ${productId} not found`);
        error.code = 'NOT_FOUND';
        error.statusCode = 404;
        throw error;
      }

      // 2. Check if user already reviewed this product
      const existing = await tx.review.findUnique({
        where: {
          product_id_user_id: {
            product_id: productId,
            user_id: userId,
          },
        },
      });

      if (existing) {
        const error = new Error('You have already submitted a review for this product');
        error.code = 'CONFLICT';
        error.statusCode = 409;
        throw error;
      }

      // 3. Create review record
      const review = await tx.review.create({
        data: {
          product_id: productId,
          user_id: userId,
          rating,
          title: title || null,
          comment,
        },
      });

      // 4. Create outbox event record atomically
      const eventId = uuidv4();
      const payload = {
        eventId,
        eventType: 'review.created',
        productId,
        reviewId: review.id,
        userId,
        rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.created_at.toISOString(),
      };

      await tx.catalogOutbox.create({
        data: {
          event_type: 'review.created',
          aggregate_type: 'ProductReview',
          aggregate_id: review.id,
          payload,
          status: 'PENDING',
        },
      });

      return { review, eventId };
    });

    // Invalidate caches AFTER successful database commit
    await this.invalidateReviewCaches(productId);

    return result;
  }

  /**
   * Retrieves paginated reviews for a product with cache-aside
   */
  async findByProduct({ productId, page = 1, limit = 20 }) {
    const cacheKey = CacheKeys.catalog.reviews(productId, page, limit);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
          this.prisma.review.findMany({
            where: { product_id: productId },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
          }),
          this.prisma.review.count({
            where: { product_id: productId },
          }),
        ]);

        return {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
          },
        };
      },
      config.cache?.reviewTtl || 120,
    );
  }

  /**
   * Aggregates reviews for a product to compute count and average rating with cache-aside
   */
  async aggregateRating(productId) {
    const cacheKey = CacheKeys.catalog.ratingSummary(productId);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const aggregate = await this.prisma.review.aggregate({
          where: { product_id: productId },
          _count: { rating: true },
          _avg: { rating: true },
        });

        const totalReviews = aggregate._count.rating || 0;
        const rawAvg = aggregate._avg.rating || 0;
        const averageRating = Number(Number(rawAvg).toFixed(2));

        return { totalReviews, averageRating };
      },
      config.cache?.reviewTtl || 120,
    );
  }

  /**
   * Invalidate all review-related caches for a product
   */
  async invalidateReviewCaches(productId) {
    await Promise.all([
      this.cache.deleteByPattern(CacheKeys.catalog.reviewsPattern(productId)),
      this.cache.delete(CacheKeys.catalog.ratingSummary(productId)),
      this.cache.delete(CacheKeys.catalog.product(productId)),
    ]);
  }

  /**
   * Atomically recalculates product rating and records processed event
   */
  async recalculateAndRecordEvent({ productId, consumerGroup, eventId, eventType }) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Check idempotency: if already processed, return early
      const existing = await tx.processedEvent.findUnique({
        where: {
          consumer_group_event_id: {
            consumer_group: consumerGroup,
            event_id: eventId,
          },
        },
      });

      if (existing) {
        return { alreadyProcessed: true };
      }

      // 2. Aggregate reviews for this product
      const aggregate = await tx.review.aggregate({
        where: { product_id: productId },
        _count: { rating: true },
        _avg: { rating: true },
      });

      const totalReviews = aggregate._count.rating || 0;
      const rawAvg = aggregate._avg.rating || 0;
      const averageRating = Number(Number(rawAvg).toFixed(2));

      // 3. Update Product record with fresh rating & review count
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          average_rating: averageRating,
          total_reviews: totalReviews,
        },
      });

      // 4. Mark event as processed in ProcessedEvent table
      await tx.processedEvent.create({
        data: {
          event_id: eventId,
          consumer_group: consumerGroup,
          event_type: eventType || 'review.created',
        },
      });

      return {
        alreadyProcessed: false,
        productId,
        averageRating,
        totalReviews,
        slug: updatedProduct.slug,
      };
    });

    // Invalidate product & review caches AFTER database commit
    await this.invalidateReviewCaches(productId);
    if (result.slug) {
      await this.cache.delete(`catalog:product:slug:${result.slug}`);
    }

    return result;
  }
}
