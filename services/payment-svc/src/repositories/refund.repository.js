import { prisma as defaultPrisma } from '../lib/prisma.js';

export class RefundRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async findByPaymentAndOrder(paymentId, orderId, tx = this.prisma) {
    const refund = await tx.paymentRefund.findUnique({
      where: {
        payment_id_order_id: {
          payment_id: paymentId,
          order_id: orderId,
        },
      },
    });
    return refund;
  }

  async createRefund(
    { paymentId, orderId, amount, currency = 'INR', reason = null, status = 'REQUESTED' },
    tx = this.prisma,
  ) {
    const refund = await tx.paymentRefund.create({
      data: {
        payment_id: paymentId,
        order_id: orderId,
        amount,
        currency,
        reason,
        status,
      },
    });
    return refund;
  }

  async updateRefundStatus(
    { refundId, status, razorpayRefundId = null, failureReason = null },
    tx = this.prisma,
  ) {
    const data = { status };
    if (razorpayRefundId) {
      data.razorpay_refund_id = razorpayRefundId;
    }
    if (failureReason) {
      data.failure_reason = failureReason;
    }
    const refund = await tx.paymentRefund.update({
      where: { id: refundId },
      data,
    });
    return refund;
  }

  async completeRefundAtomic(
    { refundId, paymentId, razorpayRefundId, outboxEvent = null },
    tx = this.prisma,
  ) {
    const executeInTx = async (prismaTx) => {
      // 1. Update PaymentRefund to PROCESSED
      const updatedRefund = await prismaTx.paymentRefund.update({
        where: { id: refundId },
        data: {
          status: 'PROCESSED',
          razorpay_refund_id: razorpayRefundId,
        },
      });

      // 2. Update Payment to REFUNDED
      const updatedPayment = await prismaTx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
        },
      });

      // 3. Insert PaymentOutbox Event
      if (outboxEvent) {
        await prismaTx.paymentOutbox.create({
          data: {
            event_type: 'payment.refunded',
            aggregate_type: 'Payment',
            aggregate_id: paymentId,
            payload: {
              eventId: crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}`,
              eventType: 'payment.refunded',
              aggregateType: 'Payment',
              aggregateId: paymentId,
              occurredAt: new Date().toISOString(),
              version: '1.0',
              payload: {
                refundId: updatedRefund.id,
                paymentId,
                orderId: updatedRefund.order_id,
                amount: updatedRefund.amount,
                currency: updatedRefund.currency,
                razorpayRefundId,
                status: 'PROCESSED',
                ...outboxEvent.payload,
              },
            },
            status: 'PENDING',
          },
        });
      }

      return { refund: updatedRefund, payment: updatedPayment };
    };

    if (tx && tx !== this.prisma) {
      const res = await executeInTx(tx);
      return res;
    }
    const res = await this.prisma.$transaction(executeInTx);
    return res;
  }
}

export const refundRepository = new RefundRepository();
