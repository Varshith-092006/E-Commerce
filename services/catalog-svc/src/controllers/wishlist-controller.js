import { successResponse } from '@ecommerce/shared';

import { WishlistService } from '../services/wishlist-service.js';

export class WishlistController {
  constructor(wishlistService = new WishlistService()) {
    this.wishlistService = wishlistService;
  }

  getWishlist = async (req, res, next) => {
    try {
      const items = await this.wishlistService.getWishlist(req.user.id);
      return res.status(200).json(
        successResponse({
          data: items,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  addItem = async (req, res, next) => {
    try {
      const { productId } = req.body;
      const item = await this.wishlistService.addToWishlist(req.user.id, productId);
      return res.status(201).json(
        successResponse({
          data: item,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (req, res, next) => {
    try {
      const { productId } = req.params;
      await this.wishlistService.removeFromWishlist(req.user.id, productId);
      return res.status(200).json(
        successResponse({
          data: { message: 'Item removed from wishlist' },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
