import { successResponse, ValidationError } from '@ecommerce/shared';

import { couponService as defaultCouponService } from '../services/coupon.service.js';

export class CouponController {
  constructor(couponService = defaultCouponService) {
    this.couponService = couponService;
  }

  validateCoupon = async (req, res, next) => {
    try {
      const { code, subtotal } = req.body || {};
      // Derive userId strictly from trusted internal/auth context
      const userId = req.user?.id || req.headers['x-user-id'] || null;

      const result = await this.couponService.validateCoupon({
        code,
        subtotal,
        userId,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  redeemCoupon = async (req, res, next) => {
    try {
      const { code, orderId, discountAmount, userId: bodyUserId } = req.body || {};
      // For internal mesh calls from order-svc, userId may be passed in body or headers
      const userId = req.user?.id || req.headers['x-user-id'] || bodyUserId;

      if (!userId) {
        throw new ValidationError('Customer user ID is required for coupon redemption');
      }

      const result = await this.couponService.redeemCoupon({
        code,
        userId,
        orderId,
        discountAmount,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const couponController = new CouponController();
