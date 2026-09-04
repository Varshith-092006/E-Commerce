import { successResponse, ValidationError } from '@ecommerce/shared';

import { checkoutService as defaultCheckoutService } from '../services/checkout.service.js';

export class CheckoutController {
  constructor(checkoutService = defaultCheckoutService) {
    this.checkoutService = checkoutService;
  }

  getUserId(req) {
    const userId = req.user?.id || req.headers['x-user-id'];
    if (!userId) {
      throw new ValidationError('Authenticated customer ID is missing');
    }
    return userId;
  }

  calculateCheckout = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { addressId, couponCode, buyNowItem, useCart } = req.body || {};

      // Mutual exclusivity validation: Cannot specify both useCart=true and buyNowItem
      if (useCart === true && buyNowItem) {
        throw new ValidationError('Cannot specify both cart checkout and Buy Now simultaneously');
      }

      const checkoutSummary = await this.checkoutService.calculateCheckout({
        userId,
        addressId,
        couponCode: couponCode || null,
        buyNowItem: buyNowItem || null,
        requestId: req.id,
      });

      return res.status(200).json(
        successResponse({
          data: checkoutSummary,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const checkoutController = new CheckoutController();
