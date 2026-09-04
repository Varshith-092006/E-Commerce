import { jest } from '@jest/globals';
import { ReturnRefundService } from '../../src/services/return-refund.service.js';
import { ValidationError, NotFoundError, EventTypes } from '@ecommerce/shared';

describe('ReturnRefundService Unit Tests (Phase 4D)', () => {
  let returnRefundService;
  let mockPaymentRepo;
  let mockRefundRepo;
  let mockOutboxRepo;
  let mockPaymentService;

  beforeEach(() => {
    mockPaymentRepo = {
      findByOrderId: jest.fn(),
    };

    mockRefundRepo = {
      findByPaymentIdAndOrderId: jest.fn(),
      createRefund: jest.fn(),
    };

    mockOutboxRepo = {
      createEvent: jest.fn(),
    };

    mockPaymentService = {
      refundPayment: jest.fn(),
    };

    returnRefundService = new ReturnRefundService({
      paymentRepo: mockPaymentRepo,
      refundRepo: mockRefundRepo,
      outboxRepo: mockOutboxRepo,
      paymentService: mockPaymentService,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger Razorpay online refund when payment method is RAZORPAY', async () => {
    mockPaymentRepo.findByOrderId.mockResolvedValue({
      id: 'pay-rzp-1',
      order_id: 'ord-100',
      user_id: 'user-1',
      payment_method: 'RAZORPAY',
      amount: '1200.00',
      currency: 'INR',
    });

    mockPaymentService.refundPayment.mockResolvedValue({
      refundId: 'ref-rzp-1',
      paymentId: 'pay-rzp-1',
      orderId: 'ord-100',
      status: 'PROCESSED',
      razorpayRefundId: 'rfnd_123',
    });

    const res = await returnRefundService.processReturnRefund({
      returnId: 'ret-100',
      returnNumber: 'RET-001',
      orderId: 'ord-100',
      userId: 'user-1',
    });

    expect(res.status).toBe('PROCESSED');
    expect(mockPaymentService.refundPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId: 'pay-rzp-1',
        orderId: 'ord-100',
      }),
    );
  });

  it('should create COD refund payout record and emit payment.refunded when payment method is COD', async () => {
    mockPaymentRepo.findByOrderId.mockResolvedValue({
      id: 'pay-cod-1',
      order_id: 'ord-200',
      user_id: 'user-2',
      payment_method: 'COD',
      amount: '850.00',
      currency: 'INR',
    });

    mockRefundRepo.findByPaymentIdAndOrderId.mockResolvedValue(null);
    mockRefundRepo.createRefund.mockResolvedValue({
      id: 'ref-cod-1',
      payment_id: 'pay-cod-1',
      order_id: 'ord-200',
      amount: '850.00',
      currency: 'INR',
      status: 'PROCESSED',
    });

    const res = await returnRefundService.processReturnRefund({
      returnId: 'ret-200',
      returnNumber: 'RET-002',
      orderId: 'ord-200',
      userId: 'user-2',
    });

    expect(res.status).toBe('PROCESSED');
    expect(mockRefundRepo.createRefund).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId: 'pay-cod-1',
        orderId: 'ord-200',
        amount: '850.00',
      }),
    );
    expect(mockOutboxRepo.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: EventTypes.PAYMENT_REFUNDED,
        aggregateId: 'pay-cod-1',
        payload: expect.objectContaining({
          returnId: 'ret-200',
          paymentMethod: 'COD',
        }),
      }),
    );
  });

  it('should return idempotent cached refund for duplicate return refund request', async () => {
    mockPaymentRepo.findByOrderId.mockResolvedValue({
      id: 'pay-cod-1',
      order_id: 'ord-300',
      payment_method: 'COD',
      amount: '500.00',
      currency: 'INR',
    });

    mockRefundRepo.findByPaymentIdAndOrderId.mockResolvedValue(null);
    mockRefundRepo.createRefund.mockResolvedValue({
      id: 'ref-cod-300',
      payment_id: 'pay-cod-1',
      order_id: 'ord-300',
      amount: '500.00',
      status: 'PROCESSED',
    });

    // Call 1
    const res1 = await returnRefundService.processReturnRefund({
      returnId: 'ret-dup-1',
      orderId: 'ord-300',
    });

    // Call 2 (duplicate)
    const res2 = await returnRefundService.processReturnRefund({
      returnId: 'ret-dup-1',
      orderId: 'ord-300',
    });

    expect(res1).toEqual(res2);
    expect(mockPaymentRepo.findByOrderId).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundError if payment record is missing for order', async () => {
    mockPaymentRepo.findByOrderId.mockResolvedValue(null);

    await expect(
      returnRefundService.processReturnRefund({
        returnId: 'ret-none',
        orderId: 'ord-missing',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError if returnId or orderId is missing', async () => {
    await expect(
      returnRefundService.processReturnRefund({ returnId: null, orderId: 'ord-1' }),
    ).rejects.toThrow(ValidationError);
  });
});
