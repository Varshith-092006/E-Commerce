import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { PaymentController } from '../../src/controllers/payment.controller.js';

describe('Payment API Integration Tests', () => {
  let app;
  let mockPaymentService;
  const internalSecret = 'test_internal_secret_123';

  beforeEach(() => {
    mockPaymentService = {
      initiatePayment: jest.fn(),
      verifyPaymentSignature: jest.fn(),
      capturePayment: jest.fn(),
      initiateCodPayment: jest.fn(),
      handleWebhook: jest.fn(),
      getPaymentById: jest.fn(),
    };

    const controller = new PaymentController(mockPaymentService, internalSecret);
    app = createApp({ paymentController: controller });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication and RBAC', () => {
    it('should return 401 Unauthorized for /initiate without x-user-id header', async () => {
      const res = await request(app)
        .post('/api/v1/payments/initiate')
        .send({ amount: 100 });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 403 Forbidden for /initiate with SELLER role', async () => {
      const res = await request(app)
        .post('/api/v1/payments/initiate')
        .set('x-user-id', 'seller-1')
        .set('x-user-role', 'SELLER')
        .send({ amount: 100 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('POST /api/v1/payments/initiate & verify', () => {
    it('should initiate payment and return 200 with paymentId and razorpayOrderId', async () => {
      mockPaymentService.initiatePayment.mockResolvedValue({
        paymentId: 'pay-1',
        razorpayOrderId: 'order_123',
        amount: '141.59',
        currency: 'INR',
        keyId: 'rzp_test_key',
      });

      const res = await request(app)
        .post('/api/v1/payments/initiate')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({ amount: 141.59, currency: 'INR' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.paymentId).toBe('pay-1');
      expect(res.body.data.razorpayOrderId).toBe('order_123');
    });

    it('should verify signature and return 200 AUTHORIZED', async () => {
      mockPaymentService.verifyPaymentSignature.mockResolvedValue({
        paymentId: 'pay-1',
        status: 'AUTHORIZED',
        verified: true,
      });

      const res = await request(app)
        .post('/api/v1/payments/verify')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({
          paymentId: 'pay-1',
          razorpayOrderId: 'order_123',
          razorpayPaymentId: 'pay_123',
          razorpaySignature: 'sig_123',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('AUTHORIZED');
      expect(res.body.data.verified).toBe(true);
    });
  });

  describe('POST /api/v1/payments/cod/initiate', () => {
    it('should initiate COD payment and return 200 with COD_PENDING', async () => {
      mockPaymentService.initiateCodPayment.mockResolvedValue({
        paymentId: 'pay-cod-1',
        status: 'COD_PENDING',
        paymentMethod: 'COD',
        amount: '141.59',
      });

      const res = await request(app)
        .post('/api/v1/payments/cod/initiate')
        .set('x-user-id', 'user-cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({ amount: 141.59 });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('COD_PENDING');
      expect(res.body.data.paymentMethod).toBe('COD');
    });
  });

  describe('POST /api/v1/payments/capture', () => {
    it('should reject capture when internal secret is missing or invalid', async () => {
      const res = await request(app)
        .post('/api/v1/payments/capture')
        .set('x-internal-gateway-secret', 'wrong_secret')
        .send({ paymentId: 'pay-1', orderId: 'ord-1' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should capture payment with valid internal secret', async () => {
      mockPaymentService.capturePayment.mockResolvedValue({
        paymentId: 'pay-1',
        status: 'CAPTURED',
        alreadyCaptured: false,
        orderId: 'ord-1',
      });

      const res = await request(app)
        .post('/api/v1/payments/capture')
        .set('x-internal-gateway-secret', internalSecret)
        .send({ paymentId: 'pay-1', orderId: 'ord-1' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('CAPTURED');
    });
  });

  describe('POST /api/v1/payments/webhook', () => {
    it('should accept and process valid razorpay webhook', async () => {
      mockPaymentService.handleWebhook.mockResolvedValue({
        received: true,
        event: 'payment.captured',
      });

      const res = await request(app)
        .post('/api/v1/payments/webhook')
        .set('x-razorpay-signature', 'valid_webhook_signature')
        .send({ event: 'payment.captured' });

      expect(res.status).toBe(200);
      expect(res.body.data.received).toBe(true);
    });
  });
});
