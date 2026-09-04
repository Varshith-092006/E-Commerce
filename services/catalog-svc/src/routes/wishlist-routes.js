import { Router } from 'express';
import { authenticate } from '@ecommerce/shared';

import { WishlistController } from '../controllers/wishlist-controller.js';

export function createWishlistRoutes(wishlistController = new WishlistController()) {
  const router = Router();

  router.use(authenticate);

  router.get('/', wishlistController.getWishlist);
  router.post('/items', wishlistController.addItem);
  router.delete('/items/:productId', wishlistController.removeItem);

  return router;
}
