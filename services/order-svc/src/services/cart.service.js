import {
  ValidationError,
  NotFoundError,
  BusinessRuleError,
  ServiceUnavailableError,
  createLogger,
  getRedisClient,
  SecurityHeaders,
} from '@ecommerce/shared';

import { cartRepository as defaultCartRepo } from '../repositories/cart.repository.js';
import { config } from '../config/index.js';

const logger = createLogger({ service: 'order-svc:cart' });
const CART_REDIS_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export class CartService {
  constructor({
    cartRepo = defaultCartRepo,
    getRedis = getRedisClient,
    catalogBaseUrl = config.services?.catalog ||
      process.env.CATALOG_SVC_URL ||
      'http://localhost:4002',
    internalSecret = process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026',
  } = {}) {
    this.cartRepo = cartRepo;
    this.getRedis = getRedis;
    this.catalogBaseUrl = catalogBaseUrl;
    this.internalSecret = internalSecret;
  }

  /**
   * Safe Redis cache getter (returns null if Redis throws or is disconnected)
   */
  async _getCartFromCache(userId) {
    try {
      const redis = this.getRedis();
      if (!redis || redis.status !== 'ready') {
        return null;
      }
      const cached = await redis.get(`cart:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (err) {
      logger.warn(
        { err: err.message, userId },
        'Redis read error in cart cache (fallback to PostgreSQL)',
      );
      return null;
    }
  }

  /**
   * Safe Redis cache setter (never fails the main request)
   */
  async _setCartInCache(userId, cartData) {
    try {
      const redis = this.getRedis();
      if (!redis || redis.status !== 'ready') {
        return;
      }
      // Store unpriced structural data in Redis
      const cachePayload = {
        cartId: cartData.id,
        userId: cartData.user_id,
        items: (cartData.items || []).map((item) => ({
          id: item.id,
          productId: item.product_id,
          sellerId: item.seller_id,
          quantity: item.quantity,
        })),
      };
      await redis.setex(`cart:${userId}`, CART_REDIS_TTL_SECONDS, JSON.stringify(cachePayload));
    } catch (err) {
      logger.warn({ err: err.message, userId }, 'Redis write error in cart cache');
    }
  }

  /**
   * Safe Redis cache invalidator (never fails the main request)
   */
  async _invalidateCartCache(userId) {
    try {
      const redis = this.getRedis();
      if (!redis || redis.status !== 'ready') {
        return;
      }
      await redis.del(`cart:${userId}`);
    } catch (err) {
      logger.warn({ err: err.message, userId }, 'Redis cache invalidation warning');
    }
  }

  /**
   * Internal HTTP call to catalog-svc to fetch authoritative product data
   */
  async _fetchProductFromCatalog(productId, requestId) {
    const url = `${this.catalogBaseUrl}/api/v1/products/${productId}`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
      };
      if (requestId) {
        headers[SecurityHeaders.REQUEST_ID] = requestId;
      }

      const res = await fetch(url, { headers });
      if (res.status === 404) {
        return null;
      }
      if (!res.ok) {
        throw new Error(`Catalog service responded with status ${res.status}`);
      }
      const body = await res.json();
      return body.data || null;
    } catch (err) {
      logger.error(
        { err: err.message, productId, url },
        'Failed to fetch product from catalog-svc',
      );
      throw new ServiceUnavailableError(
        'Catalog service temporarily unavailable. Unable to verify product pricing.',
      );
    }
  }

  /**
   * Enriches structural cart items with live catalog information and computes display subtotals
   */
  async _enrichCartItems(cart, requestId) {
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        id: cart?.id || null,
        user_id: cart?.user_id || null,
        items: [],
        total_items: 0,
        subtotal: '0.00',
      };
    }

    let subtotalCents = 0;
    let totalItems = 0;

    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        const productId = item.product_id || item.productId;
        const product = await this._fetchProductFromCatalog(productId, requestId);

        if (!product) {
          return {
            id: item.id,
            product_id: productId,
            seller_id: item.seller_id || item.sellerId,
            title: 'Unavailable Product',
            price: '0.00',
            image_url: null,
            is_available: false,
            status: 'UNAVAILABLE',
            quantity: item.quantity,
            subtotal: '0.00',
          };
        }

        const unitPrice = parseFloat(product.price) || 0;
        const itemSubtotal = (unitPrice * item.quantity).toFixed(2);
        subtotalCents += Math.round(unitPrice * item.quantity * 100);
        totalItems += item.quantity;

        return {
          id: item.id,
          product_id: productId,
          seller_id: product.seller_id || item.seller_id || item.sellerId,
          title: product.title,
          price: parseFloat(product.price).toFixed(2),
          image_url: product.images?.[0]?.url || null,
          is_available: product.is_available !== false,
          status: product.status,
          quantity: item.quantity,
          subtotal: itemSubtotal,
        };
      }),
    );

    return {
      id: cart.id,
      user_id: cart.user_id,
      items: enrichedItems,
      total_items: totalItems,
      subtotal: (subtotalCents / 100).toFixed(2),
    };
  }

  /**
   * Retrieves the customer's cart (Cache-aside with live price enrichment)
   */
  async getCart(userId, requestId) {
    if (!userId) {
      throw new ValidationError('Authenticated user ID is required');
    }

    // 1. Try Redis cache for structure
    const cached = await this._getCartFromCache(userId);
    if (cached) {
      const structuralCart = {
        id: cached.cartId,
        user_id: cached.userId,
        items: cached.items.map((i) => ({
          id: i.id,
          product_id: i.productId,
          seller_id: i.sellerId,
          quantity: i.quantity,
        })),
      };
      return this._enrichCartItems(structuralCart, requestId);
    }

    // 2. Fallback to PostgreSQL
    const cart = await this.cartRepo.findOrCreateCart(userId);
    const enriched = await this._enrichCartItems(cart, requestId);

    // 3. Populate Redis cache
    await this._setCartInCache(userId, cart);

    return enriched;
  }

  /**
   * Adds an item to the customer's cart
   */
  async addItem({ userId, productId, quantity = 1, requestId }) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }
    if (!productId) {
      throw new ValidationError('Product ID is required');
    }
    const numQty = parseInt(quantity, 10);
    if (isNaN(numQty) || numQty < 1 || numQty > 99) {
      throw new ValidationError('Quantity must be an integer between 1 and 99');
    }

    // 1. Authoritative Catalog Verification
    const product = await this._fetchProductFromCatalog(productId, requestId);
    if (!product) {
      throw new NotFoundError('Product not found in catalog');
    }
    if (product.status !== 'PUBLISHED') {
      throw new BusinessRuleError('Product is not published or available for purchase');
    }
    if (product.is_available === false) {
      throw new BusinessRuleError('Product is currently out of stock');
    }

    const authoritativeSellerId = product.seller_id;
    if (!authoritativeSellerId) {
      throw new BusinessRuleError('Product is missing valid seller attribution');
    }

    // 2. Find or Create Cart in PostgreSQL
    const cart = await this.cartRepo.findOrCreateCart(userId);

    // 3. Atomic Database Upsert
    await this.cartRepo.upsertItemAtomic({
      cartId: cart.id,
      productId,
      sellerId: authoritativeSellerId,
      quantity: numQty,
    });

    // 4. Invalidate Redis Cache
    await this._invalidateCartCache(userId);

    // 5. Return updated enriched cart
    const updatedCart = await this.cartRepo.findByUserId(userId);
    await this._setCartInCache(userId, updatedCart);
    return this._enrichCartItems(updatedCart, requestId);
  }

  /**
   * Updates quantity of an existing cart item
   */
  async updateItemQuantity({ userId, itemId, quantity, requestId }) {
    if (!userId || !itemId) {
      throw new ValidationError('User ID and Item ID are required');
    }
    const numQty = parseInt(quantity, 10);
    if (isNaN(numQty) || numQty < 1 || numQty > 99) {
      throw new ValidationError('Quantity must be an integer between 1 and 99');
    }

    // 1. Update in PostgreSQL with ownership verification
    const updatedItem = await this.cartRepo.updateItemQuantity({
      itemId,
      userId,
      quantity: numQty,
    });

    if (!updatedItem) {
      throw new NotFoundError('Cart item not found in your cart');
    }

    // 2. Invalidate Cache
    await this._invalidateCartCache(userId);

    // 3. Return updated enriched cart
    const updatedCart = await this.cartRepo.findByUserId(userId);
    await this._setCartInCache(userId, updatedCart);
    return this._enrichCartItems(updatedCart, requestId);
  }

  /**
   * Removes a specific item from the cart
   */
  async removeItem({ userId, itemId, requestId }) {
    if (!userId || !itemId) {
      throw new ValidationError('User ID and Item ID are required');
    }

    const deleted = await this.cartRepo.deleteItem({
      itemId,
      userId,
    });

    if (!deleted) {
      throw new NotFoundError('Cart item not found in your cart');
    }

    await this._invalidateCartCache(userId);

    const updatedCart = await this.cartRepo.findByUserId(userId);
    await this._setCartInCache(userId, updatedCart);
    return this._enrichCartItems(updatedCart, requestId);
  }

  /**
   * Clears the entire cart
   */
  async clearCart(userId) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    await this.cartRepo.clearCart(userId);
    await this._invalidateCartCache(userId);

    return {
      id: null,
      user_id: userId,
      items: [],
      total_items: 0,
      subtotal: '0.00',
    };
  }
}

export const cartService = new CartService();
