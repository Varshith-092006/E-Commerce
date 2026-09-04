import crypto from 'crypto';

import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BusinessRuleError,
  ServiceUnavailableError,
  createLogger,
  getRedisClient,
  SecurityHeaders,
  PlatformPolicies,
  ErrorCodes,
} from '@ecommerce/shared';

import { orderRepository as defaultOrderRepo } from '../repositories/order.repository.js';
import { idempotencyRepository as defaultIdempotencyRepo } from '../repositories/idempotency.repository.js';
import { cartRepository as defaultCartRepo } from '../repositories/cart.repository.js';
import { config } from '../config/index.js';

const logger = createLogger({ service: 'order-svc:order' });

export class OrderService {
  constructor({
    orderRepo = defaultOrderRepo,
    idempotencyRepo = defaultIdempotencyRepo,
    cartRepo = defaultCartRepo,
    getRedis = getRedisClient,
    catalogBaseUrl = config.services?.catalog ||
      process.env.CATALOG_SVC_URL ||
      'http://localhost:4002',
    identityBaseUrl = config.services?.identity ||
      process.env.IDENTITY_SVC_URL ||
      'http://localhost:4001',
    paymentBaseUrl = config.services?.payment ||
      process.env.PAYMENT_SVC_URL ||
      'http://localhost:4004',
    internalSecret = process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026',
    defaultTaxRate = PlatformPolicies?.DEFAULT_TAX_RATE ?? 0.18,
    freeShippingThreshold = 100.0,
    standardShippingFee = 10.0,
  } = {}) {
    this.orderRepo = orderRepo;
    this.idempotencyRepo = idempotencyRepo;
    this.cartRepo = cartRepo;
    this.getRedis = getRedis;
    this.catalogBaseUrl = catalogBaseUrl;
    this.identityBaseUrl = identityBaseUrl;
    this.paymentBaseUrl = paymentBaseUrl;
    this.internalSecret = internalSecret;
    this.defaultTaxRate = defaultTaxRate;
    this.freeShippingThreshold = freeShippingThreshold;
    this.standardShippingFee = standardShippingFee;
  }

  /**
   * Generates a deterministic SHA-256 fingerprint hash of request payload
   */
  computeRequestHash(body) {
    const normalized = {
      addressId: body.addressId || '',
      paymentMethod: body.paymentMethod || '',
      paymentId: body.paymentId || '',
      couponCode: (body.couponCode || '').toUpperCase().trim(),
      buyNowItem: body.buyNowItem || null,
      customerNotes: body.customerNotes || '',
    };
    return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
  }

  /**
   * Validates format of Idempotency-Key
   */
  validateIdempotencyKey(key) {
    if (!key || typeof key !== 'string') {
      throw new ValidationError('Idempotency-Key header is required');
    }
    const cleanKey = key.trim();
    if (cleanKey.length < 16 || cleanKey.length > 255) {
      throw new ValidationError('Idempotency-Key must be between 16 and 255 characters');
    }
    return cleanKey;
  }

  /**
   * Helper: Calls catalog-svc to fetch product authoritatively
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
      logger.error({ err: err.message, productId }, 'Failed to fetch product from catalog-svc');
      throw new ServiceUnavailableError('Catalog service temporarily unavailable.');
    }
  }

  /**
   * Helper: Calls identity-svc to validate address ownership
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

      if (address.user_id && address.user_id !== userId) {
        throw new ForbiddenError('Delivery address does not belong to the authenticated user');
      }

      return address;
    } catch (err) {
      if (err instanceof NotFoundError || err instanceof ForbiddenError) {
        throw err;
      }
      logger.error({ err: err.message, addressId }, 'Failed to validate address with identity-svc');
      throw new ServiceUnavailableError('Identity service temporarily unavailable.');
    }
  }

  /**
   * Helper: Calls catalog-svc to validate coupon
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
        throw new BusinessRuleError(body?.error?.message || 'Invalid coupon code');
      }
      return body.data;
    } catch (err) {
      if (err instanceof BusinessRuleError) {
        throw err;
      }
      logger.error({ err: err.message, code }, 'Failed to validate coupon');
      throw new ServiceUnavailableError('Coupon service temporarily unavailable.');
    }
  }

  /**
   * Helper: Calls catalog-svc to redeem coupon upon order placement
   */
  async _redeemCouponWithCatalog({ code, userId, orderId, discountAmount, requestId }) {
    const url = `${this.catalogBaseUrl}/api/v1/coupons/redeem`;
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
        body: JSON.stringify({ code, userId, orderId, discountAmount }),
      });

      const body = await res.json();
      if (!res.ok || !body.success) {
        logger.error({ body, code, orderId }, 'Coupon redemption failed in catalog-svc');
      }
      return body?.data || null;
    } catch (err) {
      logger.error(
        { err: err.message, code, orderId },
        'Exception redeeming coupon in catalog-svc',
      );
      return null;
    }
  }

  /**
   * Helper: Calls payment-svc to capture authorized payment
   */
  async _capturePaymentWithPaymentSvc({ paymentId, orderId, requestId }) {
    const url = `${this.paymentBaseUrl}/api/v1/payments/capture`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
      };
      if (requestId) {
        headers[SecurityHeaders.REQUEST_ID] = requestId;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ paymentId, orderId }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) {
        logger.error(
          { body, paymentId, orderId },
          'Payment capture invocation failed in payment-svc',
        );
      }
      return body?.data || null;
    } catch (err) {
      logger.error(
        { err: err.message, paymentId, orderId },
        'Exception capturing payment in payment-svc',
      );
      return null;
    }
  }

  /**
   * Helper: Calls payment-svc to verify payment authorization for PREPAID orders
   */
  async _verifyPaymentAuthorization({ paymentId, userId, expectedAmount, requestId }) {
    const url = `${this.paymentBaseUrl}/api/v1/payments/${paymentId}`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
        [SecurityHeaders.USER_ID]: userId,
      };
      if (requestId) {
        headers[SecurityHeaders.REQUEST_ID] = requestId;
      }

      const res = await fetch(url, { headers });
      if (res.status === 404) {
        throw new NotFoundError(`Payment record '${paymentId}' not found`);
      }
      if (!res.ok) {
        throw new Error(`Payment service returned HTTP ${res.status}`);
      }

      const body = await res.json();
      const payment = body.data;

      // Strict Payment Ownership Check
      if (payment.user_id && payment.user_id !== userId) {
        throw new ForbiddenError('Payment does not belong to the authenticated customer');
      }

      // Strict Payment Status Check
      if (payment.status !== 'AUTHORIZED') {
        throw new BusinessRuleError(
          `Payment is not in AUTHORIZED state (current status: ${payment.status})`,
        );
      }

      // Strict Payment Amount Match
      const paidAmount = parseFloat(payment.amount);
      const targetAmount = parseFloat(expectedAmount);
      if (Math.abs(paidAmount - targetAmount) > 0.01) {
        throw new BusinessRuleError(
          `Payment amount mismatch: authorized $${paidAmount.toFixed(2)} does not match order total $${targetAmount.toFixed(2)}`,
        );
      }

      return payment;
    } catch (err) {
      if (
        err instanceof NotFoundError ||
        err instanceof ForbiddenError ||
        err instanceof BusinessRuleError
      ) {
        throw err;
      }
      logger.error({ err: err.message, paymentId }, 'Failed to verify payment with payment-svc');
      throw new ServiceUnavailableError('Payment verification service temporarily unavailable.');
    }
  }

  /**
   * Main Order Placement Engine
   */
  async createOrder({
    userId,
    idempotencyKey,
    addressId,
    paymentMethod = 'PREPAID',
    paymentId = null,
    couponCode = null,
    buyNowItem = null,
    customerNotes = null,
    requestId = null,
  }) {
    if (!userId) {
      throw new ValidationError('Authenticated customer ID is required');
    }
    const cleanIdempotencyKey = this.validateIdempotencyKey(idempotencyKey);
    const requestHash = this.computeRequestHash({
      addressId,
      paymentMethod,
      paymentId,
      couponCode,
      buyNowItem,
      customerNotes,
    });

    // 1. Check Durable Database Idempotency Record
    const existingRecord = await this.idempotencyRepo.findByKey(userId, cleanIdempotencyKey);
    if (existingRecord) {
      if (existingRecord.request_hash !== requestHash) {
        throw new ConflictError(
          'Idempotency key has already been used for a different request payload',
          { errorCode: ErrorCodes.IDEMPOTENCY_KEY_REUSED },
        );
      }
      if (existingRecord.status === 'COMPLETED' && existingRecord.response_payload) {
        return {
          order: existingRecord.response_payload,
          isReplay: true,
        };
      }
      if (existingRecord.status === 'IN_PROGRESS') {
        throw new ConflictError(
          'An order placement operation is already in progress for this idempotency key',
          { errorCode: ErrorCodes.IDEMPOTENCY_CONFLICT },
        );
      }
    }

    // 2. Fast Redis Distributed Lock (120s TTL)
    let redisLockAcquired = false;
    try {
      const redis = this.getRedis();
      if (redis && redis.status === 'ready') {
        const lockKey = `idempotency:order:${userId}:${cleanIdempotencyKey}`;
        const acquired = await redis.set(lockKey, 'IN_PROGRESS', 'NX', 'EX', 120);
        if (!acquired) {
          throw new ConflictError(
            'An order placement operation is already in progress for this idempotency key',
            { errorCode: ErrorCodes.IDEMPOTENCY_CONFLICT },
          );
        }
        redisLockAcquired = true;
      }
    } catch (err) {
      if (err instanceof ConflictError) {
        throw err;
      }
      logger.warn({ err: err.message }, 'Redis idempotency lock warning (falling back to DB lock)');
    }

    // 3. Create IN_PROGRESS Idempotency Record in PostgreSQL
    try {
      await this.idempotencyRepo.createRecord({
        userId,
        idempotencyKey: cleanIdempotencyKey,
        requestHash,
      });
    } catch (err) {
      if (err.code === 'P2002') {
        // Unique constraint violation in DB
        throw new ConflictError(
          'An order placement operation is already in progress for this idempotency key',
          { errorCode: ErrorCodes.IDEMPOTENCY_CONFLICT },
        );
      }
      throw err;
    }

    try {
      // 4. Validate Delivery Address Ownership
      const address = await this._validateAddressWithIdentity(addressId, userId, requestId);

      // 5. Resolve Items: Persistent Cart vs. Buy Now
      let rawItems = [];
      let clearCartUserId = null;

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
        const cart = await this.cartRepo.findByUserId(userId);
        if (!cart || !cart.items || cart.items.length === 0) {
          throw new BusinessRuleError('Cannot place an order with an empty cart');
        }
        rawItems = cart.items.map((i) => ({
          productId: i.product_id,
          quantity: i.quantity,
          sellerId: i.seller_id,
        }));
        clearCartUserId = userId; // Cart will be cleared in the transaction
      }

      // 6. Authoritative Re-fetch of Products, Live Prices, and Stock from catalog-svc
      let subtotalCents = 0;
      const orderItemsData = [];

      for (const rawItem of rawItems) {
        const product = await this._fetchProductFromCatalog(rawItem.productId, requestId);
        if (!product) {
          throw new NotFoundError(`Product '${rawItem.productId}' was not found in catalog`);
        }
        if (product.status !== 'PUBLISHED') {
          throw new BusinessRuleError(
            `Product '${product.title}' is no longer available for purchase`,
          );
        }
        if (product.is_available === false) {
          throw new BusinessRuleError(`Product '${product.title}' is currently out of stock`);
        }

        const unitPrice = parseFloat(product.price);
        const lineSubtotalCents = Math.round(unitPrice * rawItem.quantity * 100);
        subtotalCents += lineSubtotalCents;

        orderItemsData.push({
          product_id: product.id,
          seller_id: product.seller_id,
          title: product.title,
          unit_price: unitPrice.toFixed(2),
          quantity: rawItem.quantity,
          subtotal: (lineSubtotalCents / 100).toFixed(2),
          image_url: product.images?.[0]?.url || null,
        });
      }

      const subtotal = subtotalCents / 100;
      const subtotalStr = subtotal.toFixed(2);

      // 7. Validate Coupon
      let discountAmount = 0;
      if (couponCode && typeof couponCode === 'string' && couponCode.trim().length > 0) {
        const couponResult = await this._validateCouponWithCatalog({
          code: couponCode.trim(),
          subtotal: subtotalStr,
          userId,
          requestId,
        });
        discountAmount = parseFloat(couponResult.discount_amount) || 0;
        discountAmount = Math.min(discountAmount, subtotal);
      }

      // 8. Tax and Shipping Fee Calculation
      const taxableAmount = Math.max(0, subtotal - discountAmount);
      const taxCents = Math.round(taxableAmount * this.defaultTaxRate * 100);
      const tax = taxCents / 100;

      const isFreeShipping = subtotal >= this.freeShippingThreshold;
      const shippingFee = isFreeShipping ? 0.0 : this.standardShippingFee;

      const grandTotalCents = Math.round((subtotal - discountAmount + tax + shippingFee) * 100);
      const grandTotal = grandTotalCents / 100;
      const grandTotalStr = grandTotal.toFixed(2);

      // 9. Payment Authorization Verification (for PREPAID)
      if (paymentMethod === 'PREPAID') {
        if (!paymentId) {
          throw new ValidationError('Payment ID is required for prepaid orders');
        }
        await this._verifyPaymentAuthorization({
          paymentId,
          userId,
          expectedAmount: grandTotalStr,
          requestId,
        });
      } else if (paymentMethod !== 'COD') {
        throw new ValidationError("Payment method must be either 'PREPAID' or 'COD'");
      }

      // 10. Atomic PostgreSQL Transaction (Order + OrderItems + Outbox + Cart Clear + Idempotency Update)
      const immutableAddressSnapshot = {
        id: address.id,
        full_name: address.full_name,
        phone: address.phone,
        street_address: address.street_address,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
      };

      const pricingSnapshot = {
        subtotal: subtotalStr,
        discount: discountAmount.toFixed(2),
        coupon_code: couponCode || null,
        taxable_amount: taxableAmount.toFixed(2),
        tax_rate: this.defaultTaxRate.toFixed(2),
        tax: tax.toFixed(2),
        shipping_fee: shippingFee.toFixed(2),
        free_shipping: isFreeShipping,
        grand_total: grandTotalStr,
      };

      const outboxPayload = {
        eventId: crypto.randomUUID(),
        userId,
        paymentMethod,
        paymentId: paymentId || null,
        totalAmount: grandTotalStr,
        currency: 'USD',
        createdAt: new Date().toISOString(),
      };

      const createdOrder = await this.orderRepo.createOrderAtomic({
        orderData: {
          user_id: userId,
          payment_method: paymentMethod,
          payment_id: paymentId || null,
          shipping_address: immutableAddressSnapshot,
          pricing_snapshot: pricingSnapshot,
          coupon_code: couponCode || null,
          discount_amount: discountAmount.toFixed(2),
          total_amount: grandTotalStr,
          customer_notes: customerNotes || null,
        },
        itemsData: orderItemsData,
        outboxPayload,
        clearCartUserId,
        idempotencyUpdate: {
          userId,
          idempotencyKey: cleanIdempotencyKey,
        },
      });

      // 11. Redeem Coupon in catalog-svc (Idempotent call)
      if (couponCode && discountAmount > 0) {
        await this._redeemCouponWithCatalog({
          code: couponCode.trim(),
          userId,
          orderId: createdOrder.id,
          discountAmount: discountAmount.toFixed(2),
          requestId,
        });
      }

      // 12. Capture Payment in payment-svc (for PREPAID orders)
      if (paymentMethod === 'PREPAID' && paymentId) {
        await this._capturePaymentWithPaymentSvc({
          paymentId,
          orderId: createdOrder.id,
          requestId,
        });
      }

      // 13. Populate Completed Result in Redis Cache (24h TTL)
      try {
        const redis = this.getRedis();
        if (redis && redis.status === 'ready') {
          const lockKey = `idempotency:order:${userId}:${cleanIdempotencyKey}`;
          await redis.set(
            lockKey,
            JSON.stringify({ status: 'COMPLETED', body: createdOrder }),
            'EX',
            86400,
          );
        }
      } catch (err) {
        logger.warn({ err: err.message }, 'Redis cache populate warning');
      }

      return {
        order: createdOrder,
        isReplay: false,
      };
    } catch (err) {
      // Clean up IN_PROGRESS records on failure so user can retry
      await this.idempotencyRepo.markFailed({ userId, idempotencyKey: cleanIdempotencyKey });
      if (redisLockAcquired) {
        try {
          const redis = this.getRedis();
          if (redis && redis.status === 'ready') {
            await redis.del(`idempotency:order:${userId}:${cleanIdempotencyKey}`);
          }
        } catch {
          // ignore
        }
      }
      throw err;
    }
  }

  /**
   * Helper: Non-blocking fetch of live payment/refund status from payment-svc with 1500ms timeout
   */
  async _fetchPaymentStatus(paymentId, requestId = null) {
    if (!paymentId) {
      return null;
    }

    const url = `${this.paymentBaseUrl}/api/v1/payments/${paymentId}/status`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      const headers = {
        'Content-Type': 'application/json',
        [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
      };
      if (requestId) {
        headers[SecurityHeaders.REQUEST_ID] = requestId;
      }

      const res = await fetch(url, {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        logger.warn({ status: res.status, paymentId }, 'Payment status service returned non-200');
        return null;
      }

      const body = await res.json();
      return body.data || null;
    } catch (err) {
      clearTimeout(timeoutId);
      logger.warn(
        { err: err.message, paymentId },
        'Failed to fetch payment status (fallback to null)',
      );
      return null;
    }
  }

  /**
   * Helper: Computes deterministic tracking steps
   */
  computeTrackingInfo(order) {
    const status = order.status;
    const STEP_LABELS = [
      { label: 'Order Placed', step: 0 },
      { label: 'Confirmed', step: 1 },
      { label: 'Processing', step: 2 },
      { label: 'Shipped', step: 3 },
      { label: 'Out for Delivery', step: 4 },
      { label: 'Delivered', step: 5 },
    ];

    const STATUS_MAP = {
      PLACED: 0,
      CONFIRMED: 1,
      PROCESSING: 2,
      SHIPPED: 3,
      OUT_FOR_DELIVERY: 4,
      DELIVERED: 5,
    };

    if (status === 'CANCELLED') {
      return {
        currentStep: null,
        totalSteps: 6,
        status: 'CANCELLED',
        estimatedDelivery: null,
        steps: STEP_LABELS.map((s) => ({ ...s, completed: false })),
      };
    }

    const currentStep = STATUS_MAP[status] !== undefined ? STATUS_MAP[status] : 0;
    const estimatedDelivery = this.computeEstimatedDelivery(order);

    return {
      currentStep,
      totalSteps: 6,
      status,
      estimatedDelivery,
      steps: STEP_LABELS.map((s) => ({
        ...s,
        completed: s.step <= currentStep,
      })),
    };
  }

  /**
   * Helper: Computes state-aware estimated delivery dates
   */
  computeEstimatedDelivery(order) {
    const status = order.status;
    const createdAt = new Date(order.created_at);

    if (status === 'CANCELLED') {
      return null;
    }
    if (status === 'DELIVERED') {
      return order.updated_at ? new Date(order.updated_at).toISOString() : new Date().toISOString();
    }
    if (status === 'OUT_FOR_DELIVERY') {
      const today = new Date();
      today.setHours(21, 0, 0, 0);
      return today.toISOString();
    }
    if (status === 'SHIPPED') {
      const shippedDate = order.updated_at ? new Date(order.updated_at) : new Date();
      const est = new Date(shippedDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      return est.toISOString();
    }
    // PLACED, CONFIRMED, PROCESSING: standard 4 business days from creation
    const standardEst = new Date(createdAt.getTime() + 4 * 24 * 60 * 60 * 1000);
    return standardEst.toISOString();
  }

  async getOrderById(orderId, userId, userRole = 'CUSTOMER', requestId = null) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    // Role-based authorization
    if (userRole === 'CUSTOMER') {
      if (order.user_id !== userId) {
        throw new ForbiddenError('Access denied: You do not own this order');
      }
    } else if (userRole === 'SELLER') {
      const hasSellerItem = order.items && order.items.some((i) => i.seller_id === userId);
      if (!hasSellerItem) {
        throw new ForbiddenError('Access denied: Seller does not own items in this order');
      }
    }

    // Non-blocking payment resolution (PREPAID only)
    let paymentDetails = null;
    if (order.payment_method === 'PREPAID' && order.payment_id) {
      paymentDetails = await this._fetchPaymentStatus(order.payment_id, requestId);
    }

    const tracking = this.computeTrackingInfo(order);

    return {
      id: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      status: order.status,
      paymentMethod: order.payment_method,
      paymentId: order.payment_id || null,
      totalAmount: order.total_amount,
      cancellationReason: order.cancellation_reason || null,
      cancelledAt: order.cancelled_at || null,
      cancelledBy: order.cancelled_by || null,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      shippingAddress: order.shipping_address,
      pricingSnapshot: order.pricing_snapshot,
      items: (order.items || []).map((i) => ({
        id: i.id,
        productId: i.product_id,
        sellerId: i.seller_id,
        title: i.title,
        unitPrice: i.unit_price,
        quantity: i.quantity,
        subtotal: i.subtotal,
        imageUrl: i.image_url || null,
        status: i.status,
      })),
      statusHistory: (order.status_history || []).map((h) => ({
        id: h.id,
        fromStatus: h.from_status,
        toStatus: h.to_status,
        changedBy: h.changed_by,
        actorRole: h.actor_role,
        reason: h.reason,
        createdAt: h.created_at,
      })),
      tracking,
      paymentDetails,
    };
  }

  async getCustomerOrders({
    userId,
    userRole = 'CUSTOMER',
    page = 1,
    limit = 20,
    status = null,
    search = null,
  } = {}) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Parse comma-separated statuses if provided
    let statusFilter = [];
    if (status && typeof status === 'string') {
      statusFilter = status
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s.length > 0);
    }

    const [orders, total] = await Promise.all([
      this.orderRepo.findOrders({
        userId,
        userRole,
        statuses: statusFilter,
        search,
        skip,
        take: limitNum,
      }),
      this.orderRepo.countOrders({
        userId,
        userRole,
        statuses: statusFilter,
        search,
      }),
    ]);

    // Format lightweight list response
    const formattedList = orders.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      createdAt: o.created_at,
      status: o.status,
      paymentMethod: o.payment_method,
      totalAmount: o.total_amount,
      itemsCount: o.items ? o.items.length : 0,
      itemsPreview: (o.items || []).slice(0, 3).map((i) => ({
        id: i.id,
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        imageUrl: i.image_url || null,
      })),
    }));

    return {
      items: formattedList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getOrderInvoice(orderId, userId, userRole = 'CUSTOMER', requestId = null) {
    if (!orderId || !userId) {
      throw new ValidationError('Order ID and User ID are required');
    }

    // Seller is strictly forbidden from accessing customer tax invoices
    if (userRole === 'SELLER') {
      throw new ForbiddenError('Sellers are not permitted to access customer tax invoices');
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    // Customer can only invoice their own order
    if (userRole === 'CUSTOMER' && order.user_id !== userId) {
      throw new ForbiddenError('Access denied: You do not own this order');
    }

    // Non-blocking payment resolution
    let paymentDetails = null;
    if (order.payment_method === 'PREPAID' && order.payment_id) {
      paymentDetails = await this._fetchPaymentStatus(order.payment_id, requestId);
    }

    // Map payment status to invoice status
    let invoicePaymentStatus = 'PAID';
    if (order.payment_method === 'COD') {
      invoicePaymentStatus = order.status === 'DELIVERED' ? 'PAID' : 'COD PENDING';
    } else if (paymentDetails) {
      const pStatus = paymentDetails.status;
      if (pStatus === 'CAPTURED') {
        invoicePaymentStatus = 'PAID';
      } else if (pStatus === 'REFUNDED') {
        invoicePaymentStatus = 'REFUNDED';
      } else if (pStatus === 'AUTHORIZED') {
        invoicePaymentStatus = 'AUTHORIZED';
      } else if (pStatus === 'FAILED') {
        invoicePaymentStatus = 'FAILED';
      } else {
        invoicePaymentStatus = pStatus;
      }
    }

    const shipping = order.shipping_address || {};
    const pricing = order.pricing_snapshot || {};

    return {
      invoiceNumber: `INV-${order.order_number}`,
      invoiceDate: order.created_at,
      orderNumber: order.order_number,
      orderDate: order.created_at,
      customer: {
        name: shipping.full_name || 'Customer',
        phone: shipping.phone || '',
        address: `${shipping.street_address || ''}, ${shipping.city || ''}, ${shipping.state || ''} - ${shipping.postal_code || ''}, ${shipping.country || ''}`,
      },
      items: (order.items || []).map((i) => ({
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        subtotal: i.subtotal,
      })),
      pricing: {
        subtotal: pricing.subtotal || order.total_amount,
        discount: pricing.discount || '0.00',
        couponCode: pricing.coupon_code || order.coupon_code || null,
        taxableAmount: pricing.taxable_amount || pricing.subtotal || order.total_amount,
        taxRate: pricing.tax_rate || '0.18',
        tax: pricing.tax || '0.00',
        shippingFee: pricing.shipping_fee || '0.00',
        grandTotal: order.total_amount,
      },
      paymentMethod: order.payment_method,
      paymentStatus: invoicePaymentStatus,
    };
  }

  /**
   * Helper: Calls payment-svc to trigger refund after cancellation
   */
  async _refundPaymentWithPaymentSvc({ paymentId, orderId, reason, requestId }) {
    const url = `${this.paymentBaseUrl}/api/v1/payments/refund`;
    try {
      const headers = {
        'Content-Type': 'application/json',
        [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
      };
      if (requestId) {
        headers[SecurityHeaders.REQUEST_ID] = requestId;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ paymentId, orderId, reason }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) {
        logger.error(
          { body, paymentId, orderId },
          'Payment refund invocation failed in payment-svc',
        );
        return {
          status: 'FAILED',
          failureReason: body?.error?.message || 'Refund invocation failed',
        };
      }
      return body.data;
    } catch (err) {
      logger.error(
        { err: err.message, paymentId, orderId },
        'Exception invoking payment refund in payment-svc',
      );
      return { status: 'FAILED', failureReason: err.message };
    }
  }

  /**
   * Orchestrates atomic order cancellation and decoupled refund trigger
   */
  async cancelOrder({ orderId, userId, userRole = 'CUSTOMER', reason, requestId = null }) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!userId) {
      throw new ValidationError('Authenticated user ID is required');
    }

    // 1. Concurrency-safe atomic transaction in order_db
    const transitionResult = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'CANCELLED',
      actorId: userId,
      actorRole: userRole,
      reason,
    });

    if (transitionResult.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    const { order, alreadyInState } = transitionResult;

    // 2. If already in CANCELLED state, return existing record idempotently
    if (alreadyInState) {
      return {
        order,
        refund: null,
        idempotent: true,
      };
    }

    // 3. Post-commit: Orchestrate refund for PREPAID orders
    let refundResult = null;
    if (order.payment_method === 'PREPAID' && order.payment_id) {
      refundResult = await this._refundPaymentWithPaymentSvc({
        paymentId: order.payment_id,
        orderId: order.id,
        reason,
        requestId,
      });
    }

    return {
      order,
      refund: refundResult,
      idempotent: false,
    };
  }

  /**
   * Orchestrates forward order status updates (Seller / Logistics / Admin)
   */
  async updateOrderStatus({ orderId, targetStatus, actorId, actorRole, reason = null }) {
    if (!orderId || !targetStatus) {
      throw new ValidationError('Order ID and target status are required');
    }
    if (!actorId || !actorRole) {
      throw new ValidationError('Actor ID and role are required');
    }
    if (actorRole.toUpperCase() === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot perform forward status updates');
    }

    const transitionResult = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus,
      actorId,
      actorRole,
      reason,
    });

    if (transitionResult.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    return transitionResult.order;
  }

  /**
   * Phase 2G: Seller-scoped order listing
   */
  async getSellerOrders({
    sellerId,
    userRole = 'SELLER',
    page = 1,
    limit = 20,
    status = null,
    search = null,
  } = {}) {
    if (!sellerId) {
      throw new ValidationError('Seller user ID is required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot access seller orders');
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    let statusFilter = [];
    if (status && typeof status === 'string') {
      statusFilter = status
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s.length > 0);
    }

    const [orders, total] = await Promise.all([
      this.orderRepo.findSellerOrders({
        sellerId,
        userRole,
        statuses: statusFilter,
        search,
        skip,
        take: limitNum,
      }),
      this.orderRepo.countSellerOrders({
        sellerId,
        userRole,
        statuses: statusFilter,
        search,
      }),
    ]);

    const formattedList = orders.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      createdAt: o.created_at,
      status: o.status,
      totalAmount: o.total_amount,
      courierName: o.courier_name || null,
      trackingNumber: o.tracking_number || null,
      shippedAt: o.shipped_at || null,
      sellerItemsCount: o.sellerItemsCount || (o.sellerItems || []).length,
      sellerItems: (o.sellerItems || []).map((i) => ({
        id: i.id,
        productId: i.product_id,
        title: i.title,
        unitPrice: i.unit_price,
        quantity: i.quantity,
        subtotal: i.subtotal,
        imageUrl: i.image_url || null,
        status: i.status,
      })),
      shippingAddress: o.shipping_address,
    }));

    return {
      items: formattedList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  /**
   * Phase 2G: Seller accepts and confirms order
   */
  async confirmSellerOrder({ orderId, sellerId, userRole = 'SELLER', reason = null }) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!sellerId) {
      throw new ValidationError('Seller ID is required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot confirm orders');
    }

    const effectiveReason = reason || 'Inventory verified and order confirmed by seller';

    const result = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'CONFIRMED',
      actorId: sellerId,
      actorRole: userRole,
      reason: effectiveReason,
    });

    if (result.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    return {
      id: result.order.id,
      orderNumber: result.order.order_number,
      status: result.order.status,
      updatedAt: result.order.updated_at,
    };
  }

  /**
   * Phase 2G: Seller packs and marks order in processing
   */
  async processSellerOrder({ orderId, sellerId, userRole = 'SELLER', reason = null }) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!sellerId) {
      throw new ValidationError('Seller ID is required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot process orders');
    }

    const effectiveReason = reason || 'Order packed and ready for dispatch';

    const result = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'PROCESSING',
      actorId: sellerId,
      actorRole: userRole,
      reason: effectiveReason,
    });

    if (result.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    return {
      id: result.order.id,
      orderNumber: result.order.order_number,
      status: result.order.status,
      updatedAt: result.order.updated_at,
    };
  }

  /**
   * Phase 2G: Seller dispatches and ships order with AWB Tracking Number
   */
  async shipSellerOrder({
    orderId,
    sellerId,
    userRole = 'SELLER',
    courierName,
    trackingNumber,
    reason = null,
  }) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!sellerId) {
      throw new ValidationError('Seller ID is required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot ship orders');
    }

    // Validate Courier Name
    if (
      !courierName ||
      typeof courierName !== 'string' ||
      courierName.trim().length < 2 ||
      courierName.trim().length > 50
    ) {
      throw new ValidationError('Courier name is required and must be between 2 and 50 characters');
    }

    // Validate Tracking / AWB Number
    if (
      !trackingNumber ||
      typeof trackingNumber !== 'string' ||
      trackingNumber.trim().length < 6 ||
      trackingNumber.trim().length > 50
    ) {
      throw new ValidationError(
        'Tracking number is required and must be between 6 and 50 characters',
      );
    }

    const cleanCourier = courierName.trim();
    const cleanTracking = trackingNumber.trim();
    const effectiveReason = reason || `Handed over to ${cleanCourier} (AWB: ${cleanTracking})`;

    const result = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'SHIPPED',
      actorId: sellerId,
      actorRole: userRole,
      reason: effectiveReason,
      shippingData: {
        courierName: cleanCourier,
        trackingNumber: cleanTracking,
      },
    });

    if (result.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    return {
      id: result.order.id,
      orderNumber: result.order.order_number,
      status: result.order.status,
      courierName: result.order.courier_name,
      trackingNumber: result.order.tracking_number,
      shippedAt: result.order.shipped_at,
      updatedAt: result.order.updated_at,
    };
  }

  /**
   * Phase 2G: Generates structured shipping manifest / packing slip for seller
   */
  async getSellerPackingSlip({ orderId, sellerId, userRole = 'SELLER' }) {
    if (!orderId || !sellerId) {
      throw new ValidationError('Order ID and Seller ID are required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot access seller packing slips');
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    // Authorization check
    if (userRole === 'SELLER') {
      const hasSellerItem = order.items && order.items.some((i) => i.seller_id === sellerId);
      if (!hasSellerItem) {
        throw new ForbiddenError('Access denied: You do not own items in this order');
      }
    }

    const sellerItems =
      userRole === 'SELLER'
        ? (order.items || []).filter((i) => i.seller_id === sellerId)
        : order.items || [];

    const shipping = order.shipping_address || {};

    return {
      slipNumber: `SLIP-${order.order_number}`,
      orderNumber: order.order_number,
      orderDate: order.created_at,
      status: order.status,
      courierName: order.courier_name || 'Pending Assignment',
      trackingNumber: order.tracking_number || 'Pending Dispatch',
      recipient: {
        fullName: shipping.full_name || 'Customer',
        phone: shipping.phone || '',
        shippingAddress: `${shipping.street_address || ''}, ${shipping.city || ''}, ${shipping.state || ''} - ${shipping.postal_code || ''}, ${shipping.country || ''}`,
      },
      sellerItems: sellerItems.map((i) => ({
        productId: i.product_id,
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        subtotal: i.subtotal,
      })),
    };
  }

  /**
   * Phase 2H: Post-commit decoupled COD settlement with payment-svc
   */
  async _settleCodPaymentWithPaymentSvc({ paymentId, orderId, amountCollected, requestId = null }) {
    try {
      const url = `${this.paymentBaseUrl}/api/v1/payments/cod/settle`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const headers = {
        'Content-Type': 'application/json',
        'x-internal-gateway-secret': this.internalSecret,
      };
      if (requestId) {
        headers['x-request-id'] = requestId;
      }

      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          paymentId,
          orderId,
          amountCollected,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        logger.error(
          { paymentId, orderId, status: resp.status, err: errBody },
          'Failed to settle COD payment with payment-svc (durable outbox event will retry)',
        );
        return null;
      }

      const body = await resp.json();
      return body.data || null;
    } catch (err) {
      logger.error(
        { paymentId, orderId, err: err.message },
        'Network error while settling COD payment with payment-svc (durable outbox event will retry)',
      );
      return null;
    }
  }

  /**
   * Phase 2H: Query logistics orders run-sheet
   */
  async getLogisticsOrders({
    userRole = 'COURIER',
    page = 1,
    limit = 20,
    status = null,
    search = null,
  } = {}) {
    if (userRole === 'CUSTOMER' || userRole === 'SELLER') {
      throw new ForbiddenError(
        'Only logistics, courier, or admin accounts can access logistics orders',
      );
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    let statusFilter = ['SHIPPED', 'OUT_FOR_DELIVERY'];
    if (status && typeof status === 'string') {
      statusFilter = status
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s.length > 0);
    }

    const [orders, total] = await Promise.all([
      this.orderRepo.findLogisticsOrders({
        statuses: statusFilter,
        search,
        skip,
        take: limitNum,
      }),
      this.orderRepo.countLogisticsOrders({
        statuses: statusFilter,
        search,
      }),
    ]);

    const formattedList = orders.map((o) => {
      const shipping = o.shipping_address || {};
      return {
        id: o.id,
        orderNumber: o.order_number,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        status: o.status,
        paymentMethod: o.payment_method,
        totalAmount: o.total_amount,
        courierName: o.courier_name || null,
        trackingNumber: o.tracking_number || null,
        deliveryAgentName: o.delivery_agent_name || null,
        deliveryAgentPhone: o.delivery_agent_phone || null,
        deliveredAt: o.delivered_at || null,
        podMetadata: o.pod_metadata || null,
        deliveryAttempts: o.delivery_attempts || 0,
        shippingAddress: {
          fullName: shipping.full_name || 'Customer',
          phone: shipping.phone || '',
          streetAddress: shipping.street_address || '',
          city: shipping.city || '',
          state: shipping.state || '',
          postalCode: shipping.postal_code || '',
        },
        itemsCount: (o.items || []).length,
      };
    });

    return {
      items: formattedList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  /**
   * Phase 2H: Mark order as Out for Delivery
   */
  async markOutForDelivery({
    orderId,
    actorId,
    actorRole = 'COURIER',
    deliveryAgentName,
    deliveryAgentPhone,
    reason = null,
  }) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!actorId || !actorRole) {
      throw new ValidationError('Actor ID and role are required');
    }
    if (actorRole === 'CUSTOMER' || actorRole === 'SELLER') {
      throw new ForbiddenError('Customer and seller accounts cannot mark orders out for delivery');
    }

    if (
      !deliveryAgentName ||
      typeof deliveryAgentName !== 'string' ||
      deliveryAgentName.trim().length < 2 ||
      deliveryAgentName.trim().length > 100
    ) {
      throw new ValidationError(
        'Delivery agent name is required and must be between 2 and 100 characters',
      );
    }

    if (
      !deliveryAgentPhone ||
      typeof deliveryAgentPhone !== 'string' ||
      deliveryAgentPhone.trim().length < 5 ||
      deliveryAgentPhone.trim().length > 30
    ) {
      throw new ValidationError(
        'Delivery agent phone is required and must be between 5 and 30 characters',
      );
    }

    const cleanAgentName = deliveryAgentName.trim();
    const cleanAgentPhone = deliveryAgentPhone.trim();
    const effectiveReason =
      reason || `Dispatched with delivery agent ${cleanAgentName} (${cleanAgentPhone})`;

    const result = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'OUT_FOR_DELIVERY',
      actorId,
      actorRole,
      reason: effectiveReason,
      deliveryAgentData: {
        deliveryAgentName: cleanAgentName,
        deliveryAgentPhone: cleanAgentPhone,
      },
    });

    if (result.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    return {
      id: result.order.id,
      orderNumber: result.order.order_number,
      status: result.order.status,
      deliveryAgentName: result.order.delivery_agent_name,
      deliveryAgentPhone: result.order.delivery_agent_phone,
      updatedAt: result.order.updated_at,
      idempotent: result.idempotent || false,
    };
  }

  /**
   * Phase 2H: Mark order as Delivered with Proof of Delivery (POD) & COD Settlement
   */
  async markDelivered({
    orderId,
    actorId,
    actorRole = 'COURIER',
    recipientName,
    podReference,
    deliveryNotes = null,
    codAmountCollected = null,
    requestId = null,
  }) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!actorId || !actorRole) {
      throw new ValidationError('Actor ID and role are required');
    }
    if (actorRole === 'CUSTOMER' || actorRole === 'SELLER') {
      throw new ForbiddenError('Customer and seller accounts cannot mark orders as delivered');
    }

    if (
      !recipientName ||
      typeof recipientName !== 'string' ||
      recipientName.trim().length < 2 ||
      recipientName.trim().length > 100
    ) {
      throw new ValidationError(
        'Recipient name is required and must be between 2 and 100 characters',
      );
    }

    if (
      !podReference ||
      typeof podReference !== 'string' ||
      podReference.trim().length < 3 ||
      podReference.trim().length > 100
    ) {
      throw new ValidationError(
        'Proof of delivery reference is required and must be between 3 and 100 characters',
      );
    }

    if (deliveryNotes && (typeof deliveryNotes !== 'string' || deliveryNotes.trim().length > 500)) {
      throw new ValidationError('Delivery notes cannot exceed 500 characters');
    }

    const cleanRecipient = recipientName.trim();
    const cleanPodRef = podReference.trim();
    const cleanNotes = deliveryNotes ? deliveryNotes.trim() : null;

    const podMetadata = {
      recipientName: cleanRecipient,
      podReference: cleanPodRef,
      deliveryNotes: cleanNotes,
      deliveredByRole: actorRole,
      deliveredByActorId: actorId,
    };

    const result = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'DELIVERED',
      actorId,
      actorRole,
      reason: 'Proof of delivery verified',
      deliveryData: podMetadata,
    });

    if (result.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    const { order, alreadyInState, idempotent } = result;

    // If already in DELIVERED state, return existing state idempotently
    if (alreadyInState || idempotent) {
      return {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        deliveredAt: order.delivered_at,
        podMetadata: order.pod_metadata,
        alreadyDelivered: true,
        idempotent: true,
      };
    }

    // Post-commit: If COD order, settle payment with payment-svc
    let codSettlementResult = null;
    if (order.payment_method === 'COD' && order.payment_id) {
      codSettlementResult = await this._settleCodPaymentWithPaymentSvc({
        paymentId: order.payment_id,
        orderId: order.id,
        amountCollected: codAmountCollected || order.total_amount,
        requestId,
      });
    }

    return {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      deliveredAt: order.delivered_at,
      podMetadata: order.pod_metadata,
      paymentStatus:
        order.payment_method === 'COD' ? codSettlementResult?.status || 'PAID' : 'PAID',
      codSettlement: codSettlementResult,
      alreadyDelivered: false,
      idempotent: false,
    };
  }

  /**
   * Phase 2H: Record Failed Delivery Attempt
   */
  async recordFailedDeliveryAttempt({ orderId, actorId, actorRole = 'COURIER', reason }) {
    if (!orderId) {
      throw new ValidationError('Order ID is required');
    }
    if (!actorId || !actorRole) {
      throw new ValidationError('Actor ID and role are required');
    }
    if (actorRole === 'CUSTOMER' || actorRole === 'SELLER') {
      throw new ForbiddenError(
        'Customer and seller accounts cannot record failed delivery attempts',
      );
    }

    if (
      !reason ||
      typeof reason !== 'string' ||
      reason.trim().length < 5 ||
      reason.trim().length > 500
    ) {
      throw new ValidationError(
        'A detailed failure reason is required (between 5 and 500 characters)',
      );
    }

    const cleanReason = reason.trim();

    const result = await this.orderRepo.recordDeliveryAttemptAtomic({
      orderId,
      actorId,
      actorRole,
      reason: cleanReason,
    });

    if (result.notFound) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    return {
      id: result.order.id,
      orderNumber: result.order.order_number,
      status: result.order.status,
      deliveryAttempts: result.order.delivery_attempts,
      reason: cleanReason,
      updatedAt: result.order.updated_at,
    };
  }

  /**
   * Admin Dashboard Summary — Aggregated from actual order_db data.
   * ADMIN only. Returns order pipeline counts, GMV, AOV.
   */
  async getAdminSummary() {
    // Run all aggregations in parallel for efficiency
    const [statusCounts, gmvResult] = await Promise.all([
      // Count orders grouped by status
      this.orderRepo.prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      // Sum total_amount for DELIVERED orders (completed GMV)
      this.orderRepo.prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { total_amount: true },
        _count: { id: true },
      }),
    ]);

    // Build a status → count map
    const countMap = {};
    for (const row of statusCounts) {
      countMap[row.status] = row._count.id;
    }

    const placedCount = countMap['PLACED'] || 0;
    const confirmedCount = countMap['CONFIRMED'] || 0;
    const processingCount = countMap['PROCESSING'] || 0;
    const shippedCount = countMap['SHIPPED'] || 0;
    const outForDeliveryCount = countMap['OUT_FOR_DELIVERY'] || 0;
    const deliveredCount = countMap['DELIVERED'] || 0;
    const cancelledCount = countMap['CANCELLED'] || 0;

    const totalGmv = Number(gmvResult._sum.total_amount || 0);
    const completedOrders = gmvResult._count.id || 0;
    const aov = completedOrders > 0 ? Number((totalGmv / completedOrders).toFixed(2)) : 0;

    const totalActive =
      placedCount + confirmedCount + processingCount + shippedCount + outForDeliveryCount;
    const grandTotal = totalActive + deliveredCount + cancelledCount;

    return {
      // Order pipeline counts
      placedCount,
      confirmedCount,
      processingCount,
      shippedCount,
      outForDeliveryCount,
      deliveredCount,
      cancelledCount,
      totalActive,
      grandTotal,
      // Sales metrics
      totalGmv,
      completedOrders,
      aov,
      // Aliases for backward compatibility with gateway aggregator
      pendingCount: placedCount,
      pendingReturnsCount: 0, // Returns are tracked in fulfillment-svc
    };
  }

  // ── Phase 2: Seller Analytics Service Layer ─────────────────────────────
  async getSellerAnalyticsOverview({
    sellerId,
    userRole = 'SELLER',
    startDate = null,
    endDate = null,
  }) {
    if (!sellerId) {
      throw new ValidationError('Seller ID is required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot access seller analytics');
    }

    if (startDate && isNaN(Date.parse(startDate))) {
      throw new ValidationError('startDate must be a valid ISO date string');
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new ValidationError('endDate must be a valid ISO date string');
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new ValidationError('startDate cannot be after endDate');
    }

    return await this.orderRepo.getSellerAnalyticsOverview({
      sellerId,
      startDate,
      endDate,
    });
  }

  async getSellerRevenueTimeline({
    sellerId,
    userRole = 'SELLER',
    startDate = null,
    endDate = null,
    interval = 'day',
  }) {
    if (!sellerId) {
      throw new ValidationError('Seller ID is required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot access seller analytics');
    }

    const validIntervals = ['day', 'week', 'month'];
    if (!validIntervals.includes(interval.toLowerCase())) {
      throw new ValidationError(`Interval must be one of: ${validIntervals.join(', ')}`);
    }

    if (startDate && isNaN(Date.parse(startDate))) {
      throw new ValidationError('startDate must be a valid ISO date string');
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new ValidationError('endDate must be a valid ISO date string');
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new ValidationError('startDate cannot be after endDate');
    }

    return await this.orderRepo.getSellerRevenueTimeline({
      sellerId,
      startDate,
      endDate,
      interval: interval.toLowerCase(),
    });
  }

  async getSellerTopProducts({
    sellerId,
    userRole = 'SELLER',
    startDate = null,
    endDate = null,
    limit = 10,
  }) {
    if (!sellerId) {
      throw new ValidationError('Seller ID is required');
    }
    if (userRole === 'CUSTOMER') {
      throw new ForbiddenError('Customer accounts cannot access seller analytics');
    }

    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    if (startDate && isNaN(Date.parse(startDate))) {
      throw new ValidationError('startDate must be a valid ISO date string');
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new ValidationError('endDate must be a valid ISO date string');
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new ValidationError('startDate cannot be after endDate');
    }

    return await this.orderRepo.getSellerTopProducts({
      sellerId,
      startDate,
      endDate,
      limit: limitNum,
    });
  }
}

export const orderService = new OrderService();
