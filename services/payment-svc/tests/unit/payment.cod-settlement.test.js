import { jest } from '@jest/globals';
import { PaymentService } from '../../src/services/payment.service.js';
import {
  ValidationError,
  BusinessRuleError,
  NotFoundError,
} from '@ecommerce/shared';

describe('COD Payment Settlement Unit Tests', () => {
  let paymentService;
  let mockPaymentRepo;
  let mockRefundRepo;

  const paymentId = 'p1a2b3c4-0000-0000-0000-000000000001';
  const orderId = 'o1a2b3c4-0000-0000-0000-000000000001';
  const userId = 'u1a2b3c4-0000-0000-0000-000000000001';

  const sampleCodPayment = {
    id: paymentId,
    order_id: orderId,
    user_id: userId,
    payment_method: 'COD',
    status: 'COD_PENDING',
    amount: '118.00',
    currency: 'INR',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockPaymentRepo = {
      findById: jest.fn(),
      updatePaymentAtomic: jest.fn(),
    };
    mockRefundRepo = {
      findByPaymentAndOrder: jest.fn(),
    };

    paymentService = new PaymentService({
      paymentRepo: mockPaymentRepo,
      refundRepo: mockRefundRepo,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully settle a valid COD payment and create outbox event', async () => {
    mockPaymentRepo.findById.mockResolvedValue(sampleCodPayment);
    mockPaymentRepo.updatePaymentAtomic.mockResolvedValue({
      ...sampleCodPayment,
      status: 'CAPTURED',
    });

    const res = await paymentService.settleCodPayment({
      paymentId,
      orderId,
      amountCollected: '118.00',
    });

    expect(res.status).toBe('CAPTURED');
    expect(res.settled).toBe(true);
    expect(res.alreadySettled).toBe(false);
    expect(res.idempotent).toBe(false);

    expect(mockPaymentRepo.updatePaymentAtomic).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId,
        status: 'CAPTURED',
        outboxEvent: expect.objectContaining({
          eventType: 'payment.captured',
          payload: expect.objectContaining({
            paymentId,
            orderId,
            paymentMethod: 'COD',
          }),
        }),
      }),
    );
  });

  it('should be strictly idempotent when payment is already CAPTURED', async () => {
    mockPaymentRepo.findById.mockResolvedValue({
      ...sampleCodPayment,
      status: 'CAPTURED',
    });

    const res = await paymentService.settleCodPayment({
      paymentId,
      orderId,
      amountCollected: '118.00',
    });

    expect(res.status).toBe('CAPTURED');
    expect(res.settled).toBe(true);
    expect(res.alreadySettled).toBe(true);
    expect(res.idempotent).toBe(true);
    expect(mockPaymentRepo.updatePaymentAtomic).not.toHaveBeenCalled();
  });

  it('should reject when amountCollected does not match expected payment amount', async () => {
    mockPaymentRepo.findById.mockResolvedValue(sampleCodPayment);

    await expect(
      paymentService.settleCodPayment({
        paymentId,
        orderId,
        amountCollected: '100.00', // Mismatch! (Expected 118.00)
      }),
    ).rejects.toThrow(ValidationError);

    expect(mockPaymentRepo.updatePaymentAtomic).not.toHaveBeenCalled();
  });

  it('should reject when payment does not belong to the specified orderId', async () => {
    mockPaymentRepo.findById.mockResolvedValue(sampleCodPayment);

    await expect(
      paymentService.settleCodPayment({
        paymentId,
        orderId: 'wrong-order-uuid',
        amountCollected: '118.00',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('should reject when payment method is not COD', async () => {
    mockPaymentRepo.findById.mockResolvedValue({
      ...sampleCodPayment,
      payment_method: 'RAZORPAY',
    });

    await expect(
      paymentService.settleCodPayment({
        paymentId,
        orderId,
        amountCollected: '118.00',
      }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('should throw NotFoundError if payment record is missing', async () => {
    mockPaymentRepo.findById.mockResolvedValue(null);

    await expect(
      paymentService.settleCodPayment({
        paymentId: 'non-existent-id',
        orderId,
        amountCollected: '118.00',
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
