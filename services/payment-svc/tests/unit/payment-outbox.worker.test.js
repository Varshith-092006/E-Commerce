import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PaymentOutboxWorker } from '../../src/workers/payment-outbox.worker.js';

describe('PaymentOutboxWorker Unit Tests', () => {
  let worker;
  let mockRepo;
  const internalSecret = 'test_secret_passcode';
  const notificationBaseUrl = 'http://localhost:4006';

  beforeEach(() => {
    mockRepo = {
      claimBatch: jest.fn(),
      markProcessed: jest.fn(),
      markFailed: jest.fn(),
      releaseExpiredLeases: jest.fn(),
    };

    worker = new PaymentOutboxWorker({
      repository: mockRepo,
      notificationBaseUrl,
      internalSecret,
      workerId: 'payment_worker_test',
      batchSize: 5,
      pollIntervalMs: 50,
      lockTimeoutMs: 1000,
      maxAttempts: 3,
    });
  });

  afterEach(async () => {
    if (worker.processor.isRunning) {
      await worker.stop();
    }
    jest.clearAllMocks();
  });

  describe('Event Transformation & Routing', () => {
    it('should transform payment.captured event into valid notification payload', () => {
      const event = {
        id: 'pay-outbox-1',
        event_type: 'payment.captured',
        payload: {
          eventId: 'evt-pay-100',
          userId: 'user-1',
          orderNumber: 'ORD-999',
          amount: '118.00',
          paymentMethod: 'RAZORPAY',
        },
      };

      const result = worker.transformEventToNotification(event);

      expect(result.userId).toBe('user-1');
      expect(result.templateCode).toBe('payment.captured');
      expect(result.category).toBe('PAYMENTS');
      expect(result.idempotencyKey).toBe('evt_evt-pay-100');
      expect(result.templateData.payment.amount).toBe('118.00');
      expect(result.templateData.payment.paymentMethod).toBe('RAZORPAY');
    });

    it('should transform payment.refunded event into refund notification payload', () => {
      const event = {
        id: 'pay-outbox-2',
        event_type: 'payment.refunded',
        payload: {
          eventId: 'evt-refund-100',
          userId: 'user-2',
          orderNumber: 'ORD-555',
          amount: '50.00',
        },
      };

      const result = worker.transformEventToNotification(event);

      expect(result.templateCode).toBe('order.cancelled');
      expect(result.channels).toEqual(['EMAIL', 'IN_APP']);
      expect(result.templateData.order.refundStatus).toBe('PROCESSED');
    });
  });

  describe('Relay & Error Handling', () => {
    it('should publish payment event to Kafka topic and mark PROCESSED when useKafka is true', async () => {
      const mockProducer = { publish: jest.fn().mockResolvedValue([]) };
      const kafkaWorker = new PaymentOutboxWorker({
        repository: mockRepo,
        kafkaProducer: mockProducer,
        useKafka: true,
        workerId: 'payment_worker_kafka_test',
      });

      const event = {
        id: 'pay-outbox-1',
        event_type: 'payment.captured',
        retry_count: 0,
        payload: {
          eventId: 'evt-pay-100',
          userId: 'user-1',
          orderNumber: 'ORD-999',
          amount: '118.00',
        },
      };

      mockRepo.claimBatch.mockResolvedValueOnce([event]);

      await kafkaWorker.processor.pollAndProcess();

      expect(mockProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'ecommerce.payment-events',
          key: expect.any(String),
          eventEnvelope: expect.objectContaining({
            eventId: 'evt-pay-100',
            eventType: 'payment.captured',
          }),
        }),
      );

      expect(mockRepo.markProcessed).toHaveBeenCalledWith('pay-outbox-1');
      expect(mockRepo.markFailed).not.toHaveBeenCalled();
    });

    it('should relay payment event to notification-svc via HTTP fallback when useKafka is false', async () => {
      const httpWorker = new PaymentOutboxWorker({
        repository: mockRepo,
        notificationBaseUrl,
        internalSecret,
        useKafka: false,
        workerId: 'payment_worker_http_test',
      });

      const event = {
        id: 'pay-outbox-1',
        event_type: 'payment.captured',
        retry_count: 0,
        payload: {
          eventId: 'evt-pay-100',
          userId: 'user-1',
          orderNumber: 'ORD-999',
          amount: '118.00',
        },
      };

      mockRepo.claimBatch.mockResolvedValueOnce([event]);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await httpWorker.processor.pollAndProcess();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4006/api/v1/notifications/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-internal-gateway-secret': internalSecret,
          }),
        }),
      );

      expect(mockRepo.markProcessed).toHaveBeenCalledWith('pay-outbox-1');
      expect(mockRepo.markFailed).not.toHaveBeenCalled();
    });

    it('should schedule retry when HTTP notification-svc returns 500 error and useKafka is false', async () => {
      const httpWorker = new PaymentOutboxWorker({
        repository: mockRepo,
        notificationBaseUrl,
        internalSecret,
        useKafka: false,
        workerId: 'payment_worker_err_test',
      });

      const event = {
        id: 'pay-outbox-err',
        event_type: 'payment.captured',
        retry_count: 0,
        payload: {
          eventId: 'evt-pay-err',
          userId: 'user-1',
        },
      };

      mockRepo.claimBatch.mockResolvedValueOnce([event]);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await httpWorker.processor.pollAndProcess();

      expect(mockRepo.markProcessed).not.toHaveBeenCalled();
      expect(mockRepo.markFailed).toHaveBeenCalledWith('pay-outbox-err', {
        error: expect.stringContaining('500'),
        retryCount: 1,
        nextRetryAt: expect.any(Date),
        isPermanent: false,
      });
    });
  });
});
