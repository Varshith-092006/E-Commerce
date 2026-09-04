import { prisma as defaultPrisma } from '../lib/prisma.js';

export class CartRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Finds cart by user ID with all item relations
   */
  async findByUserId(userId, tx = this.prisma) {
    const cart = await tx.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          orderBy: { created_at: 'asc' },
        },
      },
    });
    return cart;
  }

  /**
   * Finds existing cart or atomically creates an empty one for the user
   */
  async findOrCreateCart(userId, tx = this.prisma) {
    let cart = await tx.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await tx.cart.create({
        data: {
          user_id: userId,
        },
        include: {
          items: true,
        },
      });
    }

    return cart;
  }

  /**
   * Atomically upserts a cart item, capping quantity at 99.
   * Handles concurrency without lost updates.
   */
  async upsertItemAtomic({ cartId, productId, sellerId, quantity }, tx = this.prisma) {
    // Check if item already exists in this cart
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cartId,
          product_id: productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = Math.min(99, existingItem.quantity + quantity);
      return tx.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          seller_id: sellerId,
        },
      });
    }

    const cappedQuantity = Math.min(99, Math.max(1, quantity));
    return tx.cartItem.create({
      data: {
        cart_id: cartId,
        product_id: productId,
        seller_id: sellerId,
        quantity: cappedQuantity,
      },
    });
  }

  /**
   * Updates quantity of a cart item ensuring strict ownership
   */
  async updateItemQuantity({ itemId, userId, quantity }, tx = this.prisma) {
    const item = await tx.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          user_id: userId,
        },
      },
    });

    if (!item) {
      return null;
    }

    const clampedQuantity = Math.min(99, Math.max(1, quantity));
    return tx.cartItem.update({
      where: { id: itemId },
      data: { quantity: clampedQuantity },
    });
  }

  /**
   * Deletes a cart item ensuring strict ownership
   */
  async deleteItem({ itemId, userId }, tx = this.prisma) {
    const item = await tx.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          user_id: userId,
        },
      },
    });

    if (!item) {
      return null;
    }

    return tx.cartItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Clears all items from user's cart
   */
  async clearCart(userId, tx = this.prisma) {
    const cart = await tx.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      return null;
    }

    await tx.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return {
      id: cart.id,
      user_id: userId,
      items: [],
    };
  }
}

export const cartRepository = new CartRepository();
