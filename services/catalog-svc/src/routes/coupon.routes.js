import { Router } from 'express';

import { couponController } from '../controllers/coupon.controller.js';

export function createCouponRouter({ controller = couponController } = {}) {
  const router = Router();

  router.post('/validate', controller.validateCoupon);
  router.post('/redeem', controller.redeemCoupon);

  return router;
}

export const couponRouter = createCouponRouter();
