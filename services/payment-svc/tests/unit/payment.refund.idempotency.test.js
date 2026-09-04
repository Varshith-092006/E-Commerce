import { jest } from '@jest/globals';
import { PaymentService } from '../../src/services/payment.service.js';
import {
  BusinessRuleError,
  NotFoundError,
} from '@ecommerce/shared';

describe('Payment Refund & Idempotency Unit Tests', () => {
  let paymentService;
  let mockPaymentRepo;
  let mockRefundRepo;
  let mockRazorpayProvider;

  const paymentId = 'p1a2b3c4-0000-0000-0000-000000000001';
  const orderId = 'o1a2b3c4-0000-0000-0000-000000000001';
  const refundId = 'r1a2b3c4-0000-0000-0000-000000000001';

  beforeEach(() => {
    mockPaymentRepo = {
      findById: jest.fn(),
      updatePaymentAtomic: jest.fn(),
    };

    mockRefundRepo = {
      findByPaymentAndOrder: jest.fn(),
      createRefund: jest.fn(),
      updateRefundStatus: jest.fn(),
      completeRefundAtomic: jest.fn(),
    };

    mockRazorpayProvider = {
      refundPayment: jest.fn(),
    };

    paymentService = new PaymentService({
      paymentRepo: mockPaymentRepo,
      refundRepo: mockRefundRepo,
      razorpay: mockRazorpayProvider,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Full Refund Flow & Idempotency', () => {
    it('should process initial full refund, update Payment to REFUNDED and emit PaymentOutbox', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        amount: '141.59',
        currency: 'INR',
        status: 'CAPTURED',
        razorpay_payment_id: 'pay_123',
      });

      mockRefundRepo.findByPaymentAndOrder.mockResolvedValue(null);
      mockRefundRepo.createRefund.mockResolvedValue({
        id: refundId,
        payment_id: paymentId,
        order_id: orderId,
        amount: '141.59',
        currency: 'INR',
        status: 'PROCESSING',
      });

      mockRazorpayProvider.refundPayment.mockResolvedValue({
        id: 'rfnd_rzp_123',
        amount: 14159,
        status: 'processed',
      });

      mockRefundRepo.completeRefundAtomic.mockResolvedValue({
        refund: {
          id: refundId,
          payment_id: paymentId,
          order_id: orderId,
          amount: '141.59',
          currency: 'INR',
          status: 'PROCESSED',
          razorpay_refund_id: 'rfnd_rzp_123',
        },
        payment: { id: paymentId, status: 'REFUNDED' },
      });

      const result = await paymentService.refundPayment({
        paymentId,
        orderId,
        reason: 'Customer cancelled before dispatch',
      });

      expect(result.status).toBe('PROCESSED');
      expect(result.idempotent).toBe(false);
      expect(result.razorpayRefundId).toBe('rfnd_rzp_123');

      expect(mockRazorpayProvider.refundPayment).toHaveBeenCalledWith({
        razorpayPaymentId: 'pay_123',
        amountInPaise: 14159,
      });

      expect(mockRefundRepo.completeRefundAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          refundId,
          paymentId,
          razorpayRefundId: 'rfnd_rzp_123',
          outboxEvent: expect.objectContaining({
            payload: { reason: 'Customer cancelled before dispatch' },
          }),
        }),
      );
    });

    it('should return existing PROCESSED refund with idempotent=true without calling Razorpay again', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        amount: '141.59',
        status: 'REFUNDED',
      });

      mockRefundRepo.findByPaymentAndOrder.mockResolvedValue({
        id: refundId,
        payment_id: paymentId,
        order_id: orderId,
        amount: '141.59',
        currency: 'INR',
        status: 'PROCESSED',
        razorpay_refund_id: 'rfnd_rzp_123',
      });

      const result = await paymentService.refundPayment({
        paymentId,
        orderId,
      });

      expect(result.status).toBe('PROCESSED');
      expect(result.idempotent).toBe(true);
      expect(mockRazorpayProvider.refundPayment).not.toHaveBeenCalled();
      expect(mockRefundRepo.completeRefundAtomic).not.toHaveBeenCalled();
    });

    it('should return existing PROCESSING refund with idempotent=true if request is in flight', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        amount: '141.59',
        status: 'CAPTURED',
      });

      mockRefundRepo.findByPaymentAndOrder.mockResolvedValue({
        id: refundId,
        payment_id: paymentId,
        order_id: orderId,
        amount: '141.59',
        currency: 'INR',
        status: 'PROCESSING',
      });

      const result = await paymentService.refundPayment({
        paymentId,
        orderId,
      });

      expect(result.status).toBe('PROCESSING');
      expect(result.idempotent).toBe(true);
      expect(mockRazorpayProvider.refundPayment).not.toHaveBeenCalled();
    });

    it('should handle Razorpay failure, mark refund FAILED (retryable), and keep Payment CAPTURED', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        amount: '141.59',
        status: 'CAPTURED',
        razorpay_payment_id: 'pay_123',
      });

      mockRefundRepo.findByPaymentAndOrder.mockResolvedValue(null);
      mockRefundRepo.createRefund.mockResolvedValue({
        id: refundId,
        payment_id: paymentId,
        order_id: orderId,
        amount: '141.59',
        status: 'PROCESSING',
      });

      mockRazorpayProvider.refundPayment.mockRejectedValue(new Error('Gateway timeout'));

      mockRefundRepo.updateRefundStatus.mockResolvedValue({
        id: refundId,
        payment_id: paymentId,
        order_id: orderId,
        amount: '141.59',
        currency: 'INR',
        status: 'FAILED',
      });

      const result = await paymentService.refundPayment({
        paymentId,
        orderId,
      });

      expect(result.status).toBe('FAILED');
      expect(result.retryable).toBe(true);
      expect(mockRefundRepo.completeRefundAtomic).not.toHaveBeenCalled();
      expect(mockPaymentRepo.updatePaymentAtomic).not.toHaveBeenCalled(); // Payment remains CAPTURED!
    });

    it('should reject refund when payment is in INITIATED or AUTHORIZED status', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        status: 'AUTHORIZED', // Not captured yet!
      });

      await expect(
        paymentService.refundPayment({
          paymentId,
          orderId,
        }),
      ).rejects.toThrow(BusinessRuleError);
    });

    it('should throw NotFoundError if payment does not exist', async () => {
      mockPaymentRepo.findById.mockResolvedValue(null);

      await expect(
        paymentService.refundPayment({
          paymentId: 'non-existent',
          orderId,
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
