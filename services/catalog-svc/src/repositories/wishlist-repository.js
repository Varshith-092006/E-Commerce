import { prisma } from '../lib/prisma.js';

export class WishlistRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  async findByUserId(userId) {
    const wishlist = await this.db.wishlist.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: { where: { is_thumbnail: true }, take: 1 },
              },
            },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    return wishlist ? wishlist.items : [];
  }

  async addItem(userId, productId) {
    return await this.db.$transaction(async (tx) => {
      // Find or create wishlist for user
      let wishlist = await tx.wishlist.findUnique({
        where: { user_id: userId },
      });

      if (!wishlist) {
        wishlist = await tx.wishlist.create({
          data: { user_id: userId },
        });
      }

      // Add item if not already existing
      const existingItem = await tx.wishlistItem.findUnique({
        where: {
          wishlist_id_product_id: {
            wishlist_id: wishlist.id,
            product_id: productId,
          },
        },
      });

      if (existingItem) {
        return existingItem;
      }

      return await tx.wishlistItem.create({
        data: {
          wishlist_id: wishlist.id,
          product_id: productId,
        },
        include: { product: true },
      });
    });
  }

  async removeItem(userId, productId) {
    return await this.db.$transaction(async (tx) => {
      const wishlist = await tx.wishlist.findUnique({
        where: { user_id: userId },
      });

      if (!wishlist) {
        return null;
      }

      const item = await tx.wishlistItem.findUnique({
        where: {
          wishlist_id_product_id: {
            wishlist_id: wishlist.id,
            product_id: productId,
          },
        },
      });

      if (item) {
        await tx.wishlistItem.delete({
          where: { id: item.id },
        });
      }

      return item;
    });
  }
}
