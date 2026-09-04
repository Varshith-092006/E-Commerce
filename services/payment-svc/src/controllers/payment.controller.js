import {
  successResponse,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  SecurityHeaders,
} from '@ecommerce/shared';

import { paymentService as defaultPaymentService } from '../services/payment.service.js';
import { config } from '../config/index.js';

export class PaymentController {
  constructor(paymentService = defaultPaymentService, internalSecret = config.internalSecret) {
    this.paymentService = paymentService;
    this.internalSecret = internalSecret;
  }

  getUserId(req) {
    const userId = req.user?.id || req.headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }
    return userId;
  }

  initiatePayment = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { amount, currency, metadata } = req.body || {};

      const result = await this.paymentService.initiatePayment({
        userId,
        amount,
        currency,
        metadata,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  verifyPayment = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};

      const result = await this.paymentService.verifyPaymentSignature({
        userId,
        paymentId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  capturePayment = async (req, res, next) => {
    try {
      // Validate internal service secret
      const providedSecret =
        req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET] ||
        req.headers['x-internal-gateway-secret'];
      if (!providedSecret || providedSecret !== this.internalSecret) {
        throw new UnauthorizedError('Unauthorized internal request: invalid service secret');
      }

      const { paymentId, orderId } = req.body || {};

      const result = await this.paymentService.capturePayment({
        paymentId,
        orderId,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  initiateCodPayment = async (req, res, next) => {
    try {
      const userId = this.getUserId(req);
      const { amount, currency, metadata } = req.body || {};

      const result = await this.paymentService.initiateCodPayment({
        userId,
        amount,
        currency,
        metadata,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  handleWebhook = async (req, res, next) => {
    try {
      const signature = req.headers['x-razorpay-signature'];
      if (!signature) {
        throw new ValidationError('Missing x-razorpay-signature header');
      }

      // Exact raw body buffer or string passed from express.raw() / json verify
      const rawBody = req.rawBody || JSON.stringify(req.body);

      const result = await this.paymentService.handleWebhook({
        rawBody,
        signature,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  refundPayment = async (req, res, next) => {
    try {
      const providedSecret =
        req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET] ||
        req.headers['x-internal-gateway-secret'];
      const userId = req.user?.id || req.headers['x-user-id'];

      if (!providedSecret && !userId) {
        throw new UnauthorizedError('Authentication required to issue refunds');
      }
      if (providedSecret && providedSecret !== this.internalSecret) {
        throw new UnauthorizedError('Unauthorized internal request: invalid service secret');
      }

      const { paymentId, orderId, reason } = req.body || {};

      const result = await this.paymentService.refundPayment({
        paymentId,
        orderId,
        reason,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getPaymentStatus = async (req, res, next) => {
    try {
      const providedSecret =
        req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET] ||
        req.headers['x-internal-gateway-secret'];

      if (!providedSecret || providedSecret !== this.internalSecret) {
        throw new UnauthorizedError('Unauthorized internal request: invalid service secret');
      }

      const { id: paymentId } = req.params;
      const payment = await this.paymentService.getPaymentById(paymentId);

      let refundData = null;
      if (payment.refunds && payment.refunds.length > 0) {
        const latestRefund = payment.refunds[payment.refunds.length - 1];
        refundData = {
          refundId: latestRefund.id,
          status: latestRefund.status,
          amount: latestRefund.amount,
          razorpayRefundId: latestRefund.razorpay_refund_id || null,
        };
      }

      return res.status(200).json(
        successResponse({
          data: {
            paymentId: payment.id,
            orderId: payment.order_id || null,
            status: payment.status,
            paymentMethod: payment.payment_method,
            amount: payment.amount,
            currency: payment.currency,
            razorpayPaymentId: payment.razorpay_payment_id || null,
            refund: refundData,
          },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getPaymentById = async (req, res, next) => {
    try {
      const { id: paymentId } = req.params;
      const userId = req.user?.id || req.headers['x-user-id'] || null;

      const payment = await this.paymentService.getPaymentById(paymentId, userId);

      return res.status(200).json(
        successResponse({
          data: payment,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Phase 2H: Settle COD payment internally upon delivery
   */
  settleCodPayment = async (req, res, next) => {
    try {
      const internalSecret = req.headers['x-internal-gateway-secret'];
      const expectedSecret = process.env.INTERNAL_GATEWAY_SECRET || 'internal-secret';

      if (!internalSecret || internalSecret !== expectedSecret) {
        throw new ForbiddenError('Invalid or missing internal gateway secret');
      }

      const { paymentId, orderId, amountCollected } = req.body || {};

      const result = await this.paymentService.settleCodPayment({
        paymentId,
        orderId,
        amountCollected,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Phase 4D: Automated / Admin return refund processing
   */
  processReturnRefund = async (req, res, next) => {
    try {
      const internalSecret = req.headers['x-internal-gateway-secret'];
      const expectedSecret = process.env.INTERNAL_GATEWAY_SECRET || this.internalSecret;
      const isAdmin = req.user?.role === 'ADMIN' || req.headers['x-user-role'] === 'ADMIN';

      if (!isAdmin && (!internalSecret || internalSecret !== expectedSecret)) {
        throw new ForbiddenError('Admin privileges or internal gateway secret required');
      }

      const { returnRefundService } = await import('../services/return-refund.service.js');
      const result = await returnRefundService.processReturnRefund({
        returnId: req.body.returnId || req.body.return_id,
        returnNumber: req.body.returnNumber || req.body.return_number,
        orderId: req.body.orderId || req.body.order_id,
        userId: req.body.userId || req.body.user_id,
        amount: req.body.amount,
        reason: req.body.reason,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/payments/admin/summary
   * Aggregates payment KPIs (captured, failed, refunded)
   */
  getAdminSummary = async (req, res, next) => {
    try {
      const { prisma } = await import('../lib/prisma.js');
      const [capturedAgg, failedCount, refundedAgg, refundRowsCount] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'CAPTURED' },
          _count: { id: true },
          _sum: { amount: true },
        }),
        prisma.payment.count({ where: { status: 'FAILED' } }),
        prisma.payment.aggregate({
          where: { status: 'REFUNDED' },
          _count: { id: true },
          _sum: { amount: true },
        }),
        prisma.refund.count(),
      ]);

      const capturedCount = capturedAgg._count.id || 0;
      const totalCapturedAmount = Number(Number(capturedAgg._sum.amount || 0).toFixed(2));
      const refundedCount = refundedAgg._count.id || 0;
      const totalRefundedAmount = Number(Number(refundedAgg._sum.amount || 0).toFixed(2));

      return res.status(200).json(
        successResponse({
          data: {
            capturedCount,
            totalCapturedAmount,
            failedCount,
            refundedCount,
            totalRefundedAmount,
            refundRowsCount,
          },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const paymentController = new PaymentController();
