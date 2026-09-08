import { getRedisClient, CacheService, CacheKeys } from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';
import { config } from '../config/index.js';

export class CouponRepository {
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
          defaultNamespace: 'coupon',
          defaultTtl: 300,
        });
      } catch {
        this.cache = new CacheService({ redisClient: null, enabled: false });
      }
    }
  }

  async findByCode(code, tx = this.prisma) {
    if (!code) {
      return null;
    }
    const cleanCode = code.toUpperCase().trim();
    const cacheKey = CacheKeys.coupon.code(cleanCode);

    // If inside a transaction, bypass cache and read authoritative DB
    if (tx !== this.prisma) {
      return await tx.coupon.findUnique({
        where: { code: cleanCode },
      });
    }

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await tx.coupon.findUnique({
          where: { code: cleanCode },
        });
      },
      300,
    );
  }

  async invalidateCouponCache(code) {
    if (code) {
      await this.cache.delete(CacheKeys.coupon.code(code));
    }
  }

  async getUserRedemptionCount(couponId, userId, tx = this.prisma) {
    const count = await tx.couponRedemption.count({
      where: {
        coupon_id: couponId,
        user_id: userId,
      },
    });
    return count;
  }

  async findRedemptionByOrder(couponId, orderId, tx = this.prisma) {
    if (!orderId) {
      return null;
    }
    const redemption = await tx.couponRedemption.findUnique({
      where: {
        coupon_id_order_id: {
          coupon_id: couponId,
          order_id: orderId,
        },
      },
    });
    return redemption;
  }

  async redeemCouponAtomic({ couponId, userId, orderId, discountAmount }, tx = this.prisma) {
    // 1. Idempotency check: If already redeemed for this exact order, return existing record
    if (orderId) {
      const existing = await tx.couponRedemption.findUnique({
        where: {
          coupon_id_order_id: {
            coupon_id: couponId,
            order_id: orderId,
          },
        },
      });
      if (existing) {
        return { redemption: existing, alreadyRedeemed: true };
      }
    }

    // 2. Fetch coupon and verify limits
    const coupon = await tx.coupon.findUnique({ where: { id: couponId } });
    if (!coupon || !coupon.is_active) {
      return null;
    }

    if (coupon.usage_limit !== null && coupon.current_usage >= coupon.usage_limit) {
      return null;
    }

    // 3. Check per-user limit
    const userCount = await tx.couponRedemption.count({
      where: { coupon_id: couponId, user_id: userId },
    });
    if (userCount >= coupon.per_user_limit) {
      return null;
    }

    // 4. Atomically increment usage in PostgreSQL
    const updatedCoupon = await tx.coupon.update({
      where: { id: couponId },
      data: {
        current_usage: { increment: 1 },
      },
    });

    // 5. Create redemption record
    const redemption = await tx.couponRedemption.create({
      data: {
        coupon_id: couponId,
        user_id: userId,
        order_id: orderId || null,
        discount_amount: discountAmount,
      },
    });

    // Invalidate coupon metadata cache after usage update
    await this.invalidateCouponCache(updatedCoupon.code);

    return { redemption, alreadyRedeemed: false };
  }
}

export const couponRepository = new CouponRepository();
