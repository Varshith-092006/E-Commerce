import { prisma as defaultPrisma } from '../lib/prisma.js';

export class PaymentRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async createPayment(
    {
      userId,
      amount,
      currency = 'INR',
      paymentMethod = 'RAZORPAY',
      razorpayOrderId = null,
      metadata = null,
      status = 'INITIATED',
    },
    tx = this.prisma,
  ) {
    const payment = await tx.payment.create({
      data: {
        user_id: userId,
        amount,
        currency,
        payment_method: paymentMethod,
        razorpay_order_id: razorpayOrderId,
        status,
        metadata: metadata || undefined,
      },
    });
    return payment;
  }

  async findById(id, userId = null, tx = this.prisma) {
    const whereClause = { id };
    if (userId) {
      whereClause.user_id = userId;
    }
    const payment = await tx.payment.findFirst({
      where: whereClause,
      include: {
        refunds: true,
      },
    });
    return payment;
  }

  async findByRazorpayOrderId(razorpayOrderId, tx = this.prisma) {
    if (!razorpayOrderId) {
      return null;
    }
    const payment = await tx.payment.findUnique({
      where: { razorpay_order_id: razorpayOrderId },
    });
    return payment;
  }

  async findByRazorpayPaymentId(razorpayPaymentId, tx = this.prisma) {
    if (!razorpayPaymentId) {
      return null;
    }
    const payment = await tx.payment.findUnique({
      where: { razorpay_payment_id: razorpayPaymentId },
    });
    return payment;
  }

  async updatePaymentAtomic(
    {
      paymentId,
      status,
      razorpayPaymentId = null,
      razorpaySignature = null,
      failureReason = null,
      orderId = null,
      outboxEvent = null,
    },
    tx = this.prisma,
  ) {
    const updateData = {
      status,
    };
    if (razorpayPaymentId) {
      updateData.razorpay_payment_id = razorpayPaymentId;
    }
    if (razorpaySignature) {
      updateData.razorpay_signature = razorpaySignature;
    }
    if (failureReason) {
      updateData.failure_reason = failureReason;
    }
    if (orderId) {
      updateData.order_id = orderId;
    }

    // Interactive or existing transaction
    const executeInTx = async (prismaTx) => {
      const updatedPayment = await prismaTx.payment.update({
        where: { id: paymentId },
        data: updateData,
      });

      if (outboxEvent) {
        await prismaTx.paymentOutbox.create({
          data: {
            event_type: outboxEvent.eventType,
            aggregate_type: 'Payment',
            aggregate_id: paymentId,
            payload: {
              paymentId,
              userId: updatedPayment.user_id,
              orderId: updatedPayment.order_id,
              amount: updatedPayment.amount,
              currency: updatedPayment.currency,
              status: updatedPayment.status,
              paymentMethod: updatedPayment.payment_method,
              razorpayPaymentId: updatedPayment.razorpay_payment_id,
              ...outboxEvent.payload,
            },
            status: 'PENDING',
          },
        });
      }

      return updatedPayment;
    };

    if (tx && tx !== this.prisma) {
      const res = await executeInTx(tx);
      return res;
    }
    const res = await this.prisma.$transaction(executeInTx);
    return res;
  }
}

export const paymentRepository = new PaymentRepository();
