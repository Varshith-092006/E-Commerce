import { prisma as defaultPrisma } from '../lib/prisma.js';

export class CouponRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async findByCode(code, tx = this.prisma) {
    const coupon = await tx.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });
    return coupon;
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

    // 4. Atomically increment usage
    await tx.coupon.update({
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

    return { redemption, alreadyRedeemed: false };
  }
}

export const couponRepository = new CouponRepository();
