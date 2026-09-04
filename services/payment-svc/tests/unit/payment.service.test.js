import { jest } from '@jest/globals';
import { PaymentService } from '../../src/services/payment.service.js';
import {
  ValidationError,
  ForbiddenError,
  BusinessRuleError,
  NotFoundError,
} from '@ecommerce/shared';

describe('PaymentService Unit Tests', () => {
  let paymentService;
  let mockPaymentRepo;
  let mockRazorpayProvider;

  const userId = 'u1a2b3c4-0000-0000-0000-000000000001';
  const paymentId = 'p1a2b3c4-0000-0000-0000-000000000001';
  const rzpOrderId = 'order_mock_1234567890';
  const rzpPaymentId = 'pay_mock_1234567890';
  const validSignature = 'valid_mock_signature_1234567890abcdef';

  beforeEach(() => {
    mockPaymentRepo = {
      createPayment: jest.fn(),
      findById: jest.fn(),
      findByRazorpayOrderId: jest.fn(),
      findByRazorpayPaymentId: jest.fn(),
      updatePaymentAtomic: jest.fn(),
    };

    mockRazorpayProvider = {
      createOrder: jest.fn(),
      verifyPaymentSignature: jest.fn(),
      verifyWebhookSignature: jest.fn(),
      capturePayment: jest.fn(),
    };

    paymentService = new PaymentService({
      paymentRepo: mockPaymentRepo,
      razorpay: mockRazorpayProvider,
      keyId: 'rzp_test_ApexStore2026',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Payment Initiation (PREPAID & COD)', () => {
    it('should reject payment initiation when amount <= 0', async () => {
      await expect(
        paymentService.initiatePayment({
          userId,
          amount: 0,
        }),
      ).rejects.toThrow(ValidationError);

      await expect(
        paymentService.initiatePayment({
          userId,
          amount: -50,
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should reject unsupported currency', async () => {
      await expect(
        paymentService.initiatePayment({
          userId,
          amount: 100,
          currency: 'XYZ',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should convert amount to paise and create INITIATED payment in payment_db', async () => {
      mockRazorpayProvider.createOrder.mockResolvedValue({
        id: rzpOrderId,
        amount: 14159,
        currency: 'INR',
      });

      mockPaymentRepo.createPayment.mockResolvedValue({
        id: paymentId,
        user_id: userId,
        amount: '141.59',
        currency: 'INR',
        payment_method: 'RAZORPAY',
        status: 'INITIATED',
      });

      const result = await paymentService.initiatePayment({
        userId,
        amount: 141.59,
        currency: 'INR',
      });

      expect(mockRazorpayProvider.createOrder).toHaveBeenCalledWith({
        amountInPaise: 14159,
        currency: 'INR',
      });

      expect(mockPaymentRepo.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          amount: '141.59',
          currency: 'INR',
          status: 'INITIATED',
          paymentMethod: 'RAZORPAY',
        }),
      );

      expect(result.paymentId).toBe(paymentId);
      expect(result.razorpayOrderId).toBe(rzpOrderId);
      expect(result.keyId).toBe('rzp_test_ApexStore2026');
    });

    it('should initiate COD payment with status COD_PENDING without calling Razorpay', async () => {
      mockPaymentRepo.createPayment.mockResolvedValue({
        id: 'p-cod-1',
        user_id: userId,
        amount: '141.59',
        currency: 'INR',
        payment_method: 'COD',
        status: 'COD_PENDING',
      });

      const result = await paymentService.initiateCodPayment({
        userId,
        amount: 141.59,
        currency: 'INR',
      });

      expect(mockRazorpayProvider.createOrder).not.toHaveBeenCalled();
      expect(result.status).toBe('COD_PENDING');
      expect(result.paymentMethod).toBe('COD');
    });
  });

  describe('Signature Verification', () => {
    it('should enforce payment ownership and reject foreign customer payment', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        user_id: 'user-victim-2', // Belongs to different customer!
        razorpay_order_id: rzpOrderId,
      });

      await expect(
        paymentService.verifyPaymentSignature({
          userId: 'user-attacker-1',
          paymentId,
          razorpayOrderId: rzpOrderId,
          razorpayPaymentId: rzpPaymentId,
          razorpaySignature: validSignature,
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should transition to AUTHORIZED and emit PaymentOutbox event on valid HMAC signature', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        user_id: userId,
        razorpay_order_id: rzpOrderId,
        status: 'INITIATED',
        amount: '141.59',
        currency: 'INR',
      });

      mockRazorpayProvider.verifyPaymentSignature.mockReturnValue(true);

      mockPaymentRepo.updatePaymentAtomic.mockResolvedValue({
        id: paymentId,
        status: 'AUTHORIZED',
        amount: '141.59',
        currency: 'INR',
      });

      const result = await paymentService.verifyPaymentSignature({
        userId,
        paymentId,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: validSignature,
      });

      expect(result.verified).toBe(true);
      expect(result.status).toBe('AUTHORIZED');

      expect(mockPaymentRepo.updatePaymentAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId,
          status: 'AUTHORIZED',
          razorpayPaymentId: rzpPaymentId,
          outboxEvent: expect.objectContaining({
            eventType: 'payment.authorized',
          }),
        }),
      );
    });

    it('should mark payment FAILED and reject when HMAC signature does not match', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        user_id: userId,
        razorpay_order_id: rzpOrderId,
        status: 'INITIATED',
      });

      mockRazorpayProvider.verifyPaymentSignature.mockReturnValue(false);

      await expect(
        paymentService.verifyPaymentSignature({
          userId,
          paymentId,
          razorpayOrderId: rzpOrderId,
          razorpayPaymentId: rzpPaymentId,
          razorpaySignature: 'forged_invalid_signature',
        }),
      ).rejects.toThrow(ForbiddenError);

      expect(mockPaymentRepo.updatePaymentAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId,
          status: 'FAILED',
          outboxEvent: expect.objectContaining({
            eventType: 'payment.failed',
          }),
        }),
      );
    });
  });

  describe('Payment Capture', () => {
    it('should capture an AUTHORIZED payment, associate orderId, and emit PaymentOutbox event', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        status: 'AUTHORIZED',
        amount: '141.59',
        currency: 'INR',
        razorpay_payment_id: rzpPaymentId,
      });

      mockRazorpayProvider.capturePayment.mockResolvedValue({
        id: rzpPaymentId,
        status: 'captured',
      });

      mockPaymentRepo.updatePaymentAtomic.mockResolvedValue({
        id: paymentId,
        status: 'CAPTURED',
        order_id: 'ord-1',
      });

      const result = await paymentService.capturePayment({
        paymentId,
        orderId: 'ord-1',
      });

      expect(result.status).toBe('CAPTURED');
      expect(result.alreadyCaptured).toBe(false);
      expect(mockPaymentRepo.updatePaymentAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId,
          status: 'CAPTURED',
          orderId: 'ord-1',
          outboxEvent: expect.objectContaining({
            eventType: 'payment.captured',
          }),
        }),
      );
    });

    it('should be idempotent and not capture twice if already CAPTURED', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        status: 'CAPTURED',
        order_id: 'ord-1',
      });

      const result = await paymentService.capturePayment({
        paymentId,
        orderId: 'ord-1',
      });

      expect(result.status).toBe('CAPTURED');
      expect(result.alreadyCaptured).toBe(true);
      expect(mockRazorpayProvider.capturePayment).not.toHaveBeenCalled();
      expect(mockPaymentRepo.updatePaymentAtomic).not.toHaveBeenCalled();
    });

    it('should reject capture if payment is in INITIATED or FAILED status', async () => {
      mockPaymentRepo.findById.mockResolvedValue({
        id: paymentId,
        status: 'INITIATED', // Not authorized yet!
      });

      await expect(
        paymentService.capturePayment({
          paymentId,
          orderId: 'ord-1',
        }),
      ).rejects.toThrow(BusinessRuleError);
    });
  });

  describe('Webhook Processing', () => {
    it('should reject webhook if signature is invalid', async () => {
      mockRazorpayProvider.verifyWebhookSignature.mockReturnValue(false);

      await expect(
        paymentService.handleWebhook({
          rawBody: '{"event":"payment.captured"}',
          signature: 'bad_sig',
        }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should process payment.captured webhook idempotently', async () => {
      mockRazorpayProvider.verifyWebhookSignature.mockReturnValue(true);

      mockPaymentRepo.findByRazorpayOrderId.mockResolvedValue({
        id: paymentId,
        status: 'AUTHORIZED',
      });

      const payloadStr = JSON.stringify({
        event: 'payment.captured',
        id: 'evt_123',
        payload: {
          payment: {
            entity: {
              id: rzpPaymentId,
              order_id: rzpOrderId,
            },
          },
        },
      });

      const result = await paymentService.handleWebhook({
        rawBody: payloadStr,
        signature: 'valid_sig',
      });

      expect(result.received).toBe(true);
      expect(mockPaymentRepo.updatePaymentAtomic).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentId,
          status: 'CAPTURED',
        }),
      );
    });
  });
});
