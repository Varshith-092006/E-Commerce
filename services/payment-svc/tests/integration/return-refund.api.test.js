import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { PaymentController } from '../../src/controllers/payment.controller.js';
import { returnRefundService } from '../../src/services/return-refund.service.js';

describe('Payment Return Refund API Integration Tests (Phase 4D)', () => {
  let app;
  let mockPaymentService;
  const trustedGatewaySecret =
    process.env.INTERNAL_GATEWAY_SECRET || 'test_internal_secret_123';

  beforeEach(() => {
    mockPaymentService = {
      initiatePayment: jest.fn(),
      verifyPaymentSignature: jest.fn(),
      initiateCodPayment: jest.fn(),
      refundPayment: jest.fn(),
      settleCodPayment: jest.fn(),
      getPaymentById: jest.fn(),
    };

    const paymentController = new PaymentController(
      mockPaymentService,
      trustedGatewaySecret,
    );
    app = createApp({ paymentController });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/payments/returns/refund', () => {
    it('should reject unauthenticated request with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/payments/returns/refund')
        .send({ returnId: 'ret-1', orderId: 'ord-1' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should process return refund for internal request with secret and return 200 OK', async () => {
      jest.spyOn(returnRefundService, 'processReturnRefund').mockResolvedValue({
        refundId: 'ref-1',
        paymentId: 'pay-1',
        orderId: 'ord-1',
        amount: '1000.00',
        status: 'PROCESSED',
      });

      const res = await request(app)
        .post('/api/v1/payments/returns/refund')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .send({
          returnId: 'ret-1',
          orderId: 'ord-1',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PROCESSED');
    });

    it('should process return refund for ADMIN role and return 200 OK', async () => {
      jest.spyOn(returnRefundService, 'processReturnRefund').mockResolvedValue({
        refundId: 'ref-admin-1',
        status: 'PROCESSED',
      });

      const res = await request(app)
        .post('/api/v1/payments/returns/refund')
        .set('x-user-id', 'admin-id')
        .set('x-user-role', 'ADMIN')
        .send({
          returnId: 'ret-admin-1',
          orderId: 'ord-admin-1',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
