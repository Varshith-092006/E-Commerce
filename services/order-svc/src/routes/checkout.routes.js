import { Router } from 'express';
import { UnauthorizedError, ForbiddenError } from '@ecommerce/shared';

import { checkoutController } from '../controllers/checkout.controller.js';

export function createCheckoutRouter({ controller = checkoutController } = {}) {
  const router = Router();

  const requireCustomer = (req, res, next) => {
    const userId = req.user?.id || req.headers['x-user-id'];
    const role = req.user?.role || req.headers['x-user-role'];

    if (!userId) {
      return next(new UnauthorizedError('Authentication required for checkout'));
    }

    if (role && role !== 'CUSTOMER') {
      return next(new ForbiddenError('Only customer accounts can initiate checkout'));
    }

    next();
  };

  router.use(requireCustomer);

  router.post('/calculate', controller.calculateCheckout);

  return router;
}

export const checkoutRouter = createCheckoutRouter();
