import { ValidationError, NotFoundError, BusinessRuleError } from '@ecommerce/shared';

import { couponRepository as defaultCouponRepo } from '../repositories/coupon.repository.js';

export class CouponService {
  constructor({ couponRepo = defaultCouponRepo } = {}) {
    this.couponRepo = couponRepo;
  }

  /**
   * Synchronously validates a coupon and calculates its discount amount without consuming it.
   */
  async validateCoupon({ code, subtotal, userId }) {
    if (!code || typeof code !== 'string') {
      throw new ValidationError('Coupon code is required');
    }
    const numSubtotal = parseFloat(subtotal);
    if (isNaN(numSubtotal) || numSubtotal < 0) {
      throw new ValidationError('Valid order subtotal is required');
    }

    const cleanCode = code.toUpperCase().trim();
    const coupon = await this.couponRepo.findByCode(cleanCode);

    if (!coupon) {
      throw new NotFoundError(`Coupon code '${cleanCode}' is invalid`);
    }

    if (!coupon.is_active) {
      throw new BusinessRuleError(`Coupon '${cleanCode}' is no longer active`);
    }

    const now = new Date();
    if (now < new Date(coupon.valid_from)) {
      throw new BusinessRuleError(`Coupon '${cleanCode}' is not active yet`);
    }
    if (now > new Date(coupon.valid_until)) {
      throw new BusinessRuleError(`Coupon '${cleanCode}' has expired`);
    }

    const minOrder = parseFloat(coupon.min_order_amount) || 0;
    if (numSubtotal < minOrder) {
      throw new BusinessRuleError(
        `Minimum order amount of $${minOrder.toFixed(2)} required for coupon '${cleanCode}'`,
      );
    }

    if (coupon.usage_limit !== null && coupon.current_usage >= coupon.usage_limit) {
      throw new BusinessRuleError(`Coupon '${cleanCode}' usage limit has been reached`);
    }

    if (userId) {
      const userRedemptions = await this.couponRepo.getUserRedemptionCount(coupon.id, userId);
      if (userRedemptions >= coupon.per_user_limit) {
        throw new BusinessRuleError(
          `You have already used coupon '${cleanCode}' the maximum allowed times (${coupon.per_user_limit})`,
        );
      }
    }

    // Calculate discount amount using Decimal arithmetic
    let calculatedDiscount = 0;
    const discountVal = parseFloat(coupon.discount_value) || 0;

    if (coupon.discount_type === 'PERCENTAGE') {
      calculatedDiscount = (numSubtotal * discountVal) / 100;
      if (coupon.max_discount_cap !== null) {
        const maxCap = parseFloat(coupon.max_discount_cap) || 0;
        if (maxCap > 0 && calculatedDiscount > maxCap) {
          calculatedDiscount = maxCap;
        }
      }
    } else {
      // FIXED_AMOUNT
      calculatedDiscount = discountVal;
    }

    // Discount cannot exceed subtotal
    calculatedDiscount = Math.min(calculatedDiscount, numSubtotal);
    const finalDiscountStr = (Math.round(calculatedDiscount * 100) / 100).toFixed(2);

    return {
      valid: true,
      coupon_id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: parseFloat(coupon.discount_value).toFixed(2),
      discount_amount: finalDiscountStr,
      min_order_amount: parseFloat(coupon.min_order_amount).toFixed(2),
      message: `Coupon '${coupon.code}' applied successfully ($${finalDiscountStr} discount)`,
    };
  }

  /**
   * Idempotently redeems a coupon upon order creation.
   */
  async redeemCoupon({ code, userId, orderId, discountAmount }) {
    if (!code || !userId || !orderId) {
      throw new ValidationError('Coupon code, user ID, and order ID are required for redemption');
    }

    const cleanCode = code.toUpperCase().trim();
    const coupon = await this.couponRepo.findByCode(cleanCode);

    if (!coupon) {
      throw new NotFoundError(`Coupon code '${cleanCode}' not found`);
    }

    const result = await this.couponRepo.redeemCouponAtomic({
      couponId: coupon.id,
      userId,
      orderId,
      discountAmount: parseFloat(discountAmount) || 0,
    });

    if (!result) {
      throw new BusinessRuleError(
        `Unable to redeem coupon '${cleanCode}'. Limit reached or coupon inactive.`,
      );
    }

    return {
      success: true,
      redeemed: true,
      already_redeemed: result.alreadyRedeemed,
      redemption_id: result.redemption.id,
      coupon_code: coupon.code,
      order_id: orderId,
    };
  }
}

export const couponService = new CouponService();
