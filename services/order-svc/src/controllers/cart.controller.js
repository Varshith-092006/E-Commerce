import { successResponse, ValidationError } from '@ecommerce/shared';

import { cartService as defaultCartService } from '../services/cart.service.js';

export class CartController {
  constructor(cartService = defaultCartService) {
    this.cartService = cartService;
  }

  getUserId(req) {
    const userId = req.user?.id || req.headers['x-user-id'];
    if (!userId) {
      throw new ValidationError('Authenticated customer ID is missing');
    }
    return userId;
  }

  getCart = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const cart = await this.cartService.getCart(userId, req.id);
      return res.status(200).json(
        successResponse({
          data: cart,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  addItem = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { productId, quantity } = req.body || {};

      const cart = await this.cartService.addItem({
        userId,
        productId,
        quantity,
        requestId: req.id,
      });

      return res.status(200).json(
        successResponse({
          data: cart,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  updateQuantity = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { id: itemId } = req.params;
      const { quantity } = req.body || {};

      const cart = await this.cartService.updateItemQuantity({
        userId,
        itemId,
        quantity,
        requestId: req.id,
      });

      return res.status(200).json(
        successResponse({
          data: cart,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  removeItem = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { id: itemId } = req.params;

      const cart = await this.cartService.removeItem({
        userId,
        itemId,
        requestId: req.id,
      });

      return res.status(200).json(
        successResponse({
          data: cart,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  clearCart = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const cart = await this.cartService.clearCart(userId);

      return res.status(200).json(
        successResponse({
          data: cart,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const cartController = new CartController();
