import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  BusinessRuleError,
  ServiceUnavailableError,
  createLogger,
  SecurityHeaders,
  PlatformPolicies,
  mapConcurrent,
} from '@ecommerce/shared';

import { cartRepository as defaultCartRepo } from '../repositories/cart.repository.js';
import { config } from '../config/index.js';

const logger = createLogger({ service: 'order-svc:checkout' });

export class CheckoutService {
  constructor({
    cartRepo = defaultCartRepo,
    catalogBaseUrl = config.services?.catalog ||
      process.env.CATALOG_SVC_URL ||
      'http://localhost:4002',
    identityBaseUrl = config.services?.identity ||
      process.env.IDENTITY_SVC_URL ||
      'http://localhost:4001',
    internalSecret = process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026',
    defaultTaxRate = PlatformPolicies?.DEFAULT_TAX_RATE ?? 0.18,
    freeShippingThreshold = 100.0,
    standardShippingFee = 10.0,
  } = {}) {
    this.cartRepo = cartRepo;
    this.catalogBaseUrl = catalogBaseUrl;
    this.identityBaseUrl = identityBaseUrl;
    this.internalSecret = internalSecret;
    this.defaultTaxRate = defaultTaxRate;
    this.freeShippingThreshold = freeShippingThreshold;
    this.standardShippingFee = standardShippingFee;
  }

  /**
   * Helper: Calls catalog-svc to fetch single product authoritatively
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
        throw new Error(`Catalog service returned HTTP ${res.status}`);
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
   * Helper: Calls catalog-svc to validate coupon synchronously
   */
  async _validateCouponWithCatalog({ code, subtotal, userId, requestId }) {
    const url = `${this.catalogBaseUrl}/api/v1/coupons/validate`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
        [SecurityHeaders.USER_ID]: userId,
      };
      if (requestId) {
        headers[SecurityHeaders.REQUEST_ID] = requestId;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code, subtotal }),
      });

      const body = await res.json();
      if (!res.ok || !body.success) {
        const errorMsg = body?.error?.message || 'Invalid or ineligible coupon code';
        throw new BusinessRuleError(errorMsg);
      }

      return body.data;
    } catch (err) {
      if (err instanceof BusinessRuleError) {
        throw err;
      }
      logger.error({ err: err.message, code, url }, 'Failed to validate coupon with catalog-svc');
      throw new ServiceUnavailableError('Coupon validation service temporarily unavailable.');
    }
  }

  /**
   * Helper: Calls identity-svc to validate that address exists and belongs to the customer
   */
  async _validateAddressWithIdentity(addressId, userId, requestId) {
    const url = `${this.identityBaseUrl}/api/v1/users/addresses/${addressId}`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
        [SecurityHeaders.USER_ID]: userId,
        [SecurityHeaders.USER_ROLE]: 'CUSTOMER',
      };
      if (requestId) {
        headers[SecurityHeaders.REQUEST_ID] = requestId;
      }

      const res = await fetch(url, { headers });
      if (res.status === 404) {
        throw new NotFoundError('Delivery address not found');
      }
      if (res.status === 403) {
        throw new ForbiddenError('Access denied to delivery address');
      }
      if (!res.ok) {
        throw new Error(`Identity service returned HTTP ${res.status}`);
      }

      const body = await res.json();
      const address = body.data;

      // Strict customer ownership check
      if (address.user_id && address.user_id !== userId) {
        throw new ForbiddenError('Delivery address does not belong to the authenticated user');
      }

      return address;
    } catch (err) {
      if (err instanceof NotFoundError || err instanceof ForbiddenError) {
        throw err;
      }
      logger.error(
        { err: err.message, addressId, url },
        'Failed to validate address with identity-svc',
      );
      throw new ServiceUnavailableError('Identity address service temporarily unavailable.');
    }
  }

  /**
   * Main Checkout Calculation Engine
   * Strictly server-authoritative; client prices/discounts/taxes are 100% ignored.
   */
  async calculateCheckout({
    userId,
    addressId,
    couponCode = null,
    buyNowItem = null,
    requestId = null,
  }) {
    if (!userId) {
      throw new ValidationError('Authenticated customer ID is required');
    }
    if (!addressId) {
      throw new ValidationError('Delivery address ID is required');
    }

    // 1. Address Ownership & Validity Verification
    const address = await this._validateAddressWithIdentity(addressId, userId, requestId);

    // 2. Resolve Items: Persistent Cart vs. Buy Now Direct Path
    let rawItems = [];
    if (buyNowItem) {
      if (!buyNowItem.productId) {
        throw new ValidationError('Product ID is required for Buy Now');
      }
      const qty = parseInt(buyNowItem.quantity || 1, 10);
      if (isNaN(qty) || qty < 1 || qty > 99) {
        throw new ValidationError('Buy Now quantity must be between 1 and 99');
      }
      rawItems = [{ productId: buyNowItem.productId, quantity: qty }];
    } else {
      // Fetch from persistent cart in order_db
      const cart = await this.cartRepo.findByUserId(userId);
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new BusinessRuleError('Cannot proceed to checkout with an empty cart');
      }
      rawItems = cart.items.map((i) => ({
        productId: i.product_id,
        quantity: i.quantity,
        sellerId: i.seller_id,
      }));
    }

    // 3. Authoritative Re-fetch and Price Calculation from catalog-svc (Bounded Concurrency)
    const maxCatalogConcurrency = parseInt(process.env.MAX_CATALOG_CONCURRENCY, 10) || 5;
    const validatedItems = await mapConcurrent(
      rawItems,
      async (rawItem) => {
        const product = await this._fetchProductFromCatalog(rawItem.productId, requestId);
        if (!product) {
          throw new NotFoundError(`Product '${rawItem.productId}' was not found in catalog`);
        }
        if (product.status !== 'PUBLISHED') {
          throw new BusinessRuleError(`Product '${product.title}' is no longer published`);
        }
        if (product.is_available === false) {
          throw new BusinessRuleError(`Product '${product.title}' is currently out of stock`);
        }

        const unitPrice = parseFloat(product.price);
        if (isNaN(unitPrice) || unitPrice < 0) {
          throw new BusinessRuleError(`Invalid product price for '${product.title}'`);
        }

        const lineSubtotalCents = Math.round(unitPrice * rawItem.quantity * 100);

        return {
          product_id: product.id,
          seller_id: product.seller_id,
          title: product.title,
          price: unitPrice.toFixed(2),
          quantity: rawItem.quantity,
          subtotal: (lineSubtotalCents / 100).toFixed(2),
          lineSubtotalCents,
          image_url: product.images?.[0]?.url || null,
        };
      },
      maxCatalogConcurrency,
    );

    const subtotalCents = validatedItems.reduce((sum, item) => sum + item.lineSubtotalCents, 0);
    const subtotal = subtotalCents / 100;
    const subtotalStr = subtotal.toFixed(2);

    // 4. Coupon & Discount Engine
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode && typeof couponCode === 'string' && couponCode.trim().length > 0) {
      const couponResult = await this._validateCouponWithCatalog({
        code: couponCode.trim(),
        subtotal: subtotalStr,
        userId,
        requestId,
      });

      discountAmount = parseFloat(couponResult.discount_amount) || 0;
      // Guarantee discount does not exceed subtotal
      discountAmount = Math.min(discountAmount, subtotal);
      appliedCoupon = {
        code: couponResult.code,
        discount_type: couponResult.discount_type,
        discount_value: couponResult.discount_value,
        discount_amount: discountAmount.toFixed(2),
        message: couponResult.message,
      };
    }

    // 5. Tax Calculation Engine
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxCents = Math.round(taxableAmount * this.defaultTaxRate * 100);
    const tax = taxCents / 100;

    // 6. Shipping Fee Calculation Engine
    const isFreeShipping = subtotal >= this.freeShippingThreshold;
    const shippingFee = isFreeShipping ? 0.0 : this.standardShippingFee;

    // 7. Grand Total (Decimal Precision)
    const grandTotalCents = Math.round((subtotal - discountAmount + tax + shippingFee) * 100);
    const grandTotal = grandTotalCents / 100;

    return {
      items: validatedItems,
      address: {
        id: address.id,
        full_name: address.full_name,
        phone: address.phone,
        street_address: address.street_address,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
      },
      pricing: {
        subtotal: subtotalStr,
        discount: discountAmount.toFixed(2),
        coupon: appliedCoupon,
        taxable_amount: taxableAmount.toFixed(2),
        tax_rate: this.defaultTaxRate.toFixed(2),
        tax: tax.toFixed(2),
        shipping_fee: shippingFee.toFixed(2),
        free_shipping: isFreeShipping,
        grand_total: grandTotal.toFixed(2),
      },
      is_buy_now: Boolean(buyNowItem),
    };
  }
}

export const checkoutService = new CheckoutService();
