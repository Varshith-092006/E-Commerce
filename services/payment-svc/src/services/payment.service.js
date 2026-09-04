import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  BusinessRuleError,
  createLogger,
} from '@ecommerce/shared';

import { paymentRepository as defaultPaymentRepo } from '../repositories/payment.repository.js';
import { refundRepository as defaultRefundRepo } from '../repositories/refund.repository.js';
import { razorpayProvider as defaultRazorpayProvider } from '../lib/razorpay.js';
import { config } from '../config/index.js';

const logger = createLogger({ service: 'payment-svc:service' });

export class PaymentService {
  constructor({
    paymentRepo = defaultPaymentRepo,
    refundRepo = defaultRefundRepo,
    razorpay = defaultRazorpayProvider,
    keyId = config.razorpayKeyId,
  } = {}) {
    this.paymentRepo = paymentRepo;
    this.refundRepo = refundRepo;
    this.razorpay = razorpay;
    this.keyId = keyId;
  }

  /**
   * Initiates a prepaid Razorpay payment intent
   */
  async initiatePayment({ userId, amount, currency = 'INR', metadata = null }) {
    if (!userId) {
      throw new ValidationError('Authenticated customer ID is required');
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new ValidationError('Payment amount must be a positive number greater than 0');
    }

    const supportedCurrencies = ['INR', 'USD'];
    if (!supportedCurrencies.includes(currency.toUpperCase())) {
      throw new ValidationError(
        `Currency '${currency}' is not supported. Supported: ${supportedCurrencies.join(', ')}`,
      );
    }

    const amountInPaise = Math.round(numAmount * 100);
    const amountStr = (amountInPaise / 100).toFixed(2);

    // 1. Create Upstream Razorpay Order
    const rzpOrder = await this.razorpay.createOrder({
      amountInPaise,
      currency: currency.toUpperCase(),
    });

    // 2. Persist Payment in payment_db (status: INITIATED)
    const payment = await this.paymentRepo.createPayment({
      userId,
      amount: amountStr,
      currency: currency.toUpperCase(),
      paymentMethod: 'RAZORPAY',
      razorpayOrderId: rzpOrder.id,
      status: 'INITIATED',
      metadata,
    });

    return {
      paymentId: payment.id,
      razorpayOrderId: rzpOrder.id,
      amount: amountStr,
      currency: currency.toUpperCase(),
      keyId: this.keyId,
    };
  }

  /**
   * Cryptographically verifies Razorpay Checkout signature and transitions to AUTHORIZED
   */
  async verifyPaymentSignature({
    userId,
    paymentId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) {
    if (!paymentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new ValidationError('Missing required Razorpay signature parameters');
    }

    // 1. Fetch payment and verify ownership
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new NotFoundError('Payment record not found');
    }
    if (userId && payment.user_id !== userId) {
      throw new ForbiddenError('Payment record does not belong to the authenticated user');
    }

    // 2. Verify order match
    if (payment.razorpay_order_id !== razorpayOrderId) {
      throw new BusinessRuleError('Supplied Razorpay order ID does not match payment intent');
    }

    // 3. Cryptographic timing-safe verification
    const isValid = this.razorpay.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      logger.warn({ paymentId, razorpayPaymentId }, 'Invalid Razorpay signature submitted');
      await this.paymentRepo.updatePaymentAtomic({
        paymentId: payment.id,
        status: 'FAILED',
        failureReason: 'Cryptographic signature verification failed',
        outboxEvent: {
          eventType: 'payment.failed',
          payload: { reason: 'Invalid signature' },
        },
      });
      throw new ForbiddenError('Invalid payment signature. Payment authorization rejected.');
    }

    // 4. Atomic status update to AUTHORIZED + Outbox event
    const updatedPayment = await this.paymentRepo.updatePaymentAtomic({
      paymentId: payment.id,
      status: 'AUTHORIZED',
      razorpayPaymentId,
      razorpaySignature,
      outboxEvent: {
        eventType: 'payment.authorized',
        payload: {
          razorpayOrderId,
          razorpayPaymentId,
        },
      },
    });

    return {
      paymentId: updatedPayment.id,
      status: 'AUTHORIZED',
      verified: true,
      amount: updatedPayment.amount,
      currency: updatedPayment.currency,
    };
  }

  /**
   * Captures an authorized payment (Internal API called by order-svc)
   */
  async capturePayment({ paymentId, orderId }) {
    if (!paymentId) {
      throw new ValidationError('Payment ID is required for capture');
    }

    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new NotFoundError(`Payment record '${paymentId}' not found`);
    }

    // Idempotency: If already captured, return existing success state
    if (payment.status === 'CAPTURED') {
      return {
        paymentId: payment.id,
        status: 'CAPTURED',
        alreadyCaptured: true,
        orderId: payment.order_id || orderId,
      };
    }

    if (payment.status !== 'AUTHORIZED') {
      throw new BusinessRuleError(
        `Cannot capture payment with status '${payment.status}'. Payment must be AUTHORIZED.`,
      );
    }

    const amountInPaise = Math.round(parseFloat(payment.amount) * 100);

    try {
      // Call Razorpay Capture API outside DB transaction
      await this.razorpay.capturePayment({
        razorpayPaymentId: payment.razorpay_payment_id,
        amountInPaise,
        currency: payment.currency,
      });

      // Atomic update to CAPTURED + Outbox event
      const updatedPayment = await this.paymentRepo.updatePaymentAtomic({
        paymentId: payment.id,
        status: 'CAPTURED',
        orderId: orderId || null,
        outboxEvent: {
          eventType: 'payment.captured',
          payload: {
            orderId,
            amount: payment.amount,
            currency: payment.currency,
          },
        },
      });

      return {
        paymentId: updatedPayment.id,
        status: 'CAPTURED',
        alreadyCaptured: false,
        orderId: updatedPayment.order_id,
      };
    } catch (err) {
      logger.error(
        { err: err.message, paymentId, orderId },
        'Transient payment capture error (payment remains AUTHORIZED for retry)',
      );
      // Persist failure reason without marking payment permanently FAILED
      await this.paymentRepo.updatePaymentAtomic({
        paymentId: payment.id,
        status: 'AUTHORIZED',
        failureReason: `Capture attempt failed: ${err.message}`,
      });
      throw err;
    }
  }

  /**
   * Idempotently issues a full refund for a captured payment
   */
  async refundPayment({ paymentId, orderId, reason = null }) {
    if (!paymentId || !orderId) {
      throw new ValidationError('Payment ID and Order ID are required for refund');
    }

    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new NotFoundError(`Payment record '${paymentId}' not found`);
    }

    // Strict validation: In Phase 2E, only CAPTURED payments can be refunded
    if (payment.status !== 'CAPTURED' && payment.status !== 'REFUNDED') {
      throw new BusinessRuleError(
        `Cannot refund payment with status '${payment.status}'. Payment must be in CAPTURED status.`,
      );
    }

    // 1. Check existing refund record for concurrency / idempotency
    let refund = await this.refundRepo.findByPaymentAndOrder(paymentId, orderId);

    if (refund) {
      if (refund.status === 'PROCESSED') {
        return {
          refundId: refund.id,
          paymentId: refund.payment_id,
          orderId: refund.order_id,
          amount: refund.amount,
          currency: refund.currency,
          status: 'PROCESSED',
          razorpayRefundId: refund.razorpay_refund_id,
          idempotent: true,
        };
      }
      if (refund.status === 'PROCESSING') {
        return {
          refundId: refund.id,
          paymentId: refund.payment_id,
          orderId: refund.order_id,
          amount: refund.amount,
          currency: refund.currency,
          status: 'PROCESSING',
          idempotent: true,
        };
      }
      // If FAILED, transition to PROCESSING for new retry attempt
      refund = await this.refundRepo.updateRefundStatus({
        refundId: refund.id,
        status: 'PROCESSING',
      });
    } else {
      // Create new refund in PROCESSING state
      refund = await this.refundRepo.createRefund({
        paymentId,
        orderId,
        amount: payment.amount,
        currency: payment.currency,
        reason: reason || 'Customer cancellation',
        status: 'PROCESSING',
      });
    }

    const amountInPaise = Math.round(parseFloat(payment.amount) * 100);

    try {
      // 2. Call Razorpay Refund API outside DB transaction
      const rzpRefund = await this.razorpay.refundPayment({
        razorpayPaymentId: payment.razorpay_payment_id || `pay_${payment.id}`,
        amountInPaise,
      });

      // 3. Complete refund atomically (PaymentRefund -> PROCESSED, Payment -> REFUNDED, Outbox -> payment.refunded)
      const { refund: completedRefund } = await this.refundRepo.completeRefundAtomic({
        refundId: refund.id,
        paymentId: payment.id,
        razorpayRefundId: rzpRefund.id,
        outboxEvent: {
          payload: {
            reason,
          },
        },
      });

      return {
        refundId: completedRefund.id,
        paymentId: completedRefund.payment_id,
        orderId: completedRefund.order_id,
        amount: completedRefund.amount,
        currency: completedRefund.currency,
        status: 'PROCESSED',
        razorpayRefundId: completedRefund.razorpay_refund_id,
        idempotent: false,
      };
    } catch (err) {
      logger.error({ err: err.message, paymentId, orderId }, 'Razorpay refund attempt failed');
      // Mark refund as FAILED (retryable) while Payment remains CAPTURED
      const failedRefund = await this.refundRepo.updateRefundStatus({
        refundId: refund.id,
        status: 'FAILED',
        failureReason: err.message,
      });

      return {
        refundId: failedRefund.id,
        paymentId: failedRefund.payment_id,
        orderId: failedRefund.order_id,
        amount: failedRefund.amount,
        currency: failedRefund.currency,
        status: 'FAILED',
        failureReason: err.message,
        retryable: true,
        idempotent: false,
      };
    }
  }

  /**
   * Initiates a Cash on Delivery (COD) payment
   */
  async initiateCodPayment({ userId, amount, currency = 'INR', metadata = null }) {
    if (!userId) {
      throw new ValidationError('Customer user ID is required');
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new ValidationError('Payment amount must be a positive number greater than 0');
    }

    const payment = await this.paymentRepo.createPayment({
      userId,
      amount: numAmount.toFixed(2),
      currency: currency.toUpperCase(),
      paymentMethod: 'COD',
      status: 'COD_PENDING',
      metadata,
    });

    return {
      paymentId: payment.id,
      status: 'COD_PENDING',
      paymentMethod: 'COD',
      amount: payment.amount,
      currency: payment.currency,
    };
  }

  /**
   * Processes raw Razorpay Webhooks
   */
  async handleWebhook({ rawBody, signature }) {
    const isValid = this.razorpay.verifyWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      logger.warn('Invalid Razorpay webhook signature received');
      throw new ForbiddenError('Invalid webhook signature');
    }

    const event =
      typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf8'));
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    if (paymentEntity && paymentEntity.order_id) {
      const payment = await this.paymentRepo.findByRazorpayOrderId(paymentEntity.order_id);
      if (payment) {
        if (eventType === 'payment.captured' && payment.status !== 'CAPTURED') {
          await this.paymentRepo.updatePaymentAtomic({
            paymentId: payment.id,
            status: 'CAPTURED',
            razorpayPaymentId: paymentEntity.id,
            outboxEvent: {
              eventType: 'payment.captured',
              payload: { webhookEventId: event.id },
            },
          });
        } else if (eventType === 'payment.failed' && payment.status !== 'FAILED') {
          await this.paymentRepo.updatePaymentAtomic({
            paymentId: payment.id,
            status: 'FAILED',
            failureReason: paymentEntity.error_description || 'Webhook reported payment failure',
            outboxEvent: {
              eventType: 'payment.failed',
              payload: { webhookEventId: event.id },
            },
          });
        }
      }
    }

    return { received: true, event: eventType };
  }

  async getPaymentById(paymentId, userId = null) {
    if (!paymentId) {
      throw new ValidationError('Payment ID is required');
    }
    const payment = await this.paymentRepo.findById(paymentId, userId);
    if (!payment) {
      throw new NotFoundError('Payment record not found');
    }
    return payment;
  }

  /**
   * Phase 2H: Idempotently settles a COD payment upon successful physical delivery
   */
  async settleCodPayment({ paymentId, orderId, amountCollected }) {
    if (!paymentId || !orderId) {
      throw new ValidationError('Payment ID and Order ID are required for COD settlement');
    }

    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new NotFoundError(`Payment record '${paymentId}' not found`);
    }

    if (payment.order_id !== orderId) {
      throw new ValidationError(`Payment '${paymentId}' does not match order '${orderId}'`);
    }

    if (payment.payment_method !== 'COD') {
      throw new BusinessRuleError(
        `Payment method is '${payment.payment_method}', only 'COD' can be settled via this endpoint`,
      );
    }

    // Precise integer paise comparison to avoid floating-point inaccuracies
    const expectedPaise = Math.round(Number(payment.amount) * 100);
    const collectedPaise = Math.round(Number(amountCollected) * 100);

    if (isNaN(collectedPaise) || collectedPaise !== expectedPaise) {
      throw new ValidationError(
        `Collected amount '${amountCollected}' does not match expected payment amount '${payment.amount}'`,
      );
    }

    // Idempotency: If already CAPTURED, return existing state without duplicate events
    if (payment.status === 'CAPTURED') {
      return {
        paymentId: payment.id,
        orderId: payment.order_id,
        status: 'CAPTURED',
        amount: payment.amount,
        settled: true,
        alreadySettled: true,
        idempotent: true,
      };
    }

    if (payment.status !== 'COD_PENDING') {
      throw new BusinessRuleError(
        `Cannot settle COD payment in '${payment.status}' status. Payment must be in 'COD_PENDING' status.`,
      );
    }

    const updatedPayment = await this.paymentRepo.updatePaymentAtomic({
      paymentId: payment.id,
      status: 'CAPTURED',
      outboxEvent: {
        eventType: 'payment.captured',
        payload: {
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: 'COD',
          settledAt: new Date().toISOString(),
        },
      },
    });

    return {
      paymentId: updatedPayment.id,
      orderId: updatedPayment.order_id,
      status: 'CAPTURED',
      amount: updatedPayment.amount,
      settled: true,
      alreadySettled: false,
      idempotent: false,
    };
  }
}

export const paymentService = new PaymentService();
