import { Router } from 'express';
import { UnauthorizedError, ForbiddenError } from '@ecommerce/shared';

import { cartController } from '../controllers/cart.controller.js';

export function createCartRouter({ controller = cartController } = {}) {
  const router = Router();

  // Middleware ensuring customer authentication & role
  const requireCustomer = (req, res, next) => {
    const userId = req.user?.id || req.headers['x-user-id'];
    const role = req.user?.role || req.headers['x-user-role'];

    if (!userId) {
      return next(new UnauthorizedError('Authentication required to access cart'));
    }

    if (role && role !== 'CUSTOMER') {
      return next(new ForbiddenError('Only customer accounts can maintain a shopping cart'));
    }

    next();
  };

  router.use(requireCustomer);

  router.get('/', controller.getCart);
  router.post('/items', controller.addItem);
  router.put('/items/:id', controller.updateQuantity);
  router.delete('/items/:id', controller.removeItem);
  router.delete('/', controller.clearCart);

  return router;
}

export const cartRouter = createCartRouter();
