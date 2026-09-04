import { ValidationError, NotFoundError, EventTypes, createLogger } from '@ecommerce/shared';

import { paymentRepository as defaultPaymentRepo } from '../repositories/payment.repository.js';
import { refundRepository as defaultRefundRepo } from '../repositories/refund.repository.js';
import { paymentOutboxRepository as defaultOutboxRepo } from '../repositories/outbox.repository.js';

import { PaymentService } from './payment.service.js';

const logger = createLogger({ service: 'payment-svc:return-refund' });

export class ReturnRefundService {
  constructor({
    paymentRepo = defaultPaymentRepo,
    refundRepo = defaultRefundRepo,
    outboxRepo = defaultOutboxRepo,
    paymentService = new PaymentService(),
  } = {}) {
    this.paymentRepo = paymentRepo;
    this.refundRepo = refundRepo;
    this.outboxRepo = outboxRepo;
    this.paymentService = paymentService;
    this.processedReturns = new Map();
  }

  /**
   * Orchestrates automated refund when a return is completed (Online Razorpay or COD)
   */
  async processReturnRefund({
    returnId,
    returnNumber = null,
    orderId,
    userId = null,
    amount = null,
    reason = 'Return Inspection Approved',
  }) {
    if (!returnId || typeof returnId !== 'string') {
      throw new ValidationError('Valid returnId is required for return refund');
    }
    if (!orderId || typeof orderId !== 'string') {
      throw new ValidationError('Valid orderId is required for return refund');
    }

    const idempotencyKey = `ref_ret_${returnId}`;

    // 1. In-memory & DB Idempotency Check
    if (this.processedReturns.has(idempotencyKey)) {
      logger.info(
        { returnId, orderId },
        'Return refund already processed; returning idempotent result',
      );
      return this.processedReturns.get(idempotencyKey);
    }

    // 2. Fetch original payment for this order
    const payment = await this.paymentRepo.findByOrderId(orderId);
    if (!payment) {
      throw new NotFoundError(`No payment record found for order '${orderId}'`);
    }

    let refundResult;

    // 3. Process based on payment method
    if (payment.payment_method === 'RAZORPAY') {
      logger.info(
        { returnId, orderId, paymentId: payment.id },
        'Executing automated Razorpay online gateway refund',
      );

      refundResult = await this.paymentService.refundPayment({
        paymentId: payment.id,
        orderId,
        reason: reason || `Return Refund (${returnNumber || returnId})`,
      });
    } else if (payment.payment_method === 'COD') {
      logger.info(
        { returnId, orderId, paymentId: payment.id },
        'Recording COD refund payout for return',
      );

      // Check if existing refund record exists
      const existingRefund = await this.refundRepo.findByPaymentIdAndOrderId({
        paymentId: payment.id,
        orderId,
      });

      if (existingRefund) {
        refundResult = {
          refundId: existingRefund.id,
          paymentId: existingRefund.payment_id,
          orderId: existingRefund.order_id,
          amount: existingRefund.amount,
          currency: existingRefund.currency,
          status: existingRefund.status,
          idempotent: true,
        };
      } else {
        const refundAmount = amount || payment.amount;
        const newRefund = await this.refundRepo.createRefund({
          paymentId: payment.id,
          orderId,
          amount: refundAmount,
          currency: payment.currency,
          reason: reason || `COD Return Payout (${returnNumber || returnId})`,
          status: 'PROCESSED',
        });

        // Emit payment.refunded outbox event
        await this.outboxRepo.createEvent({
          eventType: EventTypes.PAYMENT_REFUNDED,
          aggregateType: 'Payment',
          aggregateId: payment.id,
          payload: {
            paymentId: payment.id,
            orderId,
            userId: userId || payment.user_id,
            amount: refundAmount,
            currency: payment.currency,
            refundId: newRefund.id,
            returnId,
            returnNumber,
            paymentMethod: 'COD',
            reason,
          },
        });

        refundResult = {
          refundId: newRefund.id,
          paymentId: newRefund.payment_id,
          orderId: newRefund.order_id,
          amount: newRefund.amount,
          currency: newRefund.currency,
          status: 'PROCESSED',
          idempotent: false,
        };
      }
    } else {
      throw new ValidationError(`Unsupported payment method '${payment.payment_method}'`);
    }

    this.processedReturns.set(idempotencyKey, refundResult);
    return refundResult;
  }
}

export const returnRefundService = new ReturnRefundService();
