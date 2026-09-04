import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { OrderOutboxWorker } from '../../src/workers/order-outbox.worker.js';

describe('OrderOutboxWorker Unit Tests', () => {
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

    worker = new OrderOutboxWorker({
      repository: mockRepo,
      notificationBaseUrl,
      internalSecret,
      workerId: 'order_worker_test',
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
    it('should transform order.placed event into valid notification payload', () => {
      const event = {
        id: 'outbox-1',
        event_type: 'order.placed',
        payload: {
          eventId: 'evt-100',
          userId: 'user-1',
          orderNumber: 'ORD-12345',
          totalAmount: '118.00',
          shippingAddress: {
            fullName: 'Alice Smith',
            email: 'alice@example.com',
            phone: '+919876543210',
          },
        },
      };

      const result = worker.transformEventToNotification(event);

      expect(result.userId).toBe('user-1');
      expect(result.templateCode).toBe('order.placed');
      expect(result.channels).toEqual(['EMAIL', 'SMS', 'IN_APP']);
      expect(result.category).toBe('ORDERS');
      expect(result.idempotencyKey).toBe('evt_evt-100');
      expect(result.templateData.order.orderNumber).toBe('ORD-12345');
      expect(result.templateData.user.name).toBe('Alice Smith');
    });

    it('should transform order.shipped event with courier and tracking number', () => {
      const event = {
        id: 'outbox-2',
        event_type: 'order.shipped',
        payload: {
          eventId: 'evt-200',
          userId: 'user-2',
          orderNumber: 'ORD-888',
          courierName: 'BlueDart',
          trackingNumber: 'BD-123456',
        },
      };

      const result = worker.transformEventToNotification(event);

      expect(result.templateCode).toBe('order.shipped');
      expect(result.templateData.order.courierName).toBe('BlueDart');
      expect(result.templateData.order.trackingNumber).toBe('BD-123456');
    });

    it('should throw error for unsupported order event type', () => {
      const event = {
        id: 'outbox-unknown',
        event_type: 'order.unknown_event',
        payload: { userId: 'user-1' },
      };

      expect(() => worker.transformEventToNotification(event)).toThrow(
        'Unsupported order event type: "order.unknown_event"',
      );
    });
  });

  describe('Relay & Concurrency Handling', () => {
    it('should publish order event to Kafka topic and mark PROCESSED when useKafka is true', async () => {
      const mockProducer = { publish: jest.fn().mockResolvedValue([]) };
      const kafkaWorker = new OrderOutboxWorker({
        repository: mockRepo,
        kafkaProducer: mockProducer,
        useKafka: true,
        workerId: 'order_worker_kafka_test',
      });

      const event = {
        id: 'outbox-1',
        event_type: 'order.placed',
        retry_count: 0,
        payload: {
          eventId: 'evt-100',
          userId: 'user-1',
          orderNumber: 'ORD-12345',
          totalAmount: '118.00',
        },
      };

      mockRepo.claimBatch.mockResolvedValueOnce([event]);

      await kafkaWorker.processor.pollAndProcess();

      expect(mockProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'ecommerce.order-events',
          key: expect.any(String),
          eventEnvelope: expect.objectContaining({
            eventId: 'evt-100',
            eventType: 'order.placed',
          }),
        }),
      );

      expect(mockRepo.markProcessed).toHaveBeenCalledWith('outbox-1');
      expect(mockRepo.markFailed).not.toHaveBeenCalled();
    });

    it('should relay order event to notification-svc via HTTP fallback when useKafka is false', async () => {
      const httpWorker = new OrderOutboxWorker({
        repository: mockRepo,
        notificationBaseUrl,
        internalSecret,
        useKafka: false,
        workerId: 'order_worker_http_test',
      });

      const event = {
        id: 'outbox-1',
        event_type: 'order.placed',
        retry_count: 0,
        payload: {
          eventId: 'evt-100',
          userId: 'user-1',
          orderNumber: 'ORD-12345',
          totalAmount: '118.00',
          shippingAddress: { email: 'alice@example.com', fullName: 'Alice' },
        },
      };

      mockRepo.claimBatch.mockResolvedValueOnce([event]);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { dispatches: [] } }),
      });

      await httpWorker.processor.pollAndProcess();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4006/api/v1/notifications/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-internal-gateway-secret': internalSecret,
          }),
          body: expect.stringContaining('evt_evt-100'),
        }),
      );

      expect(mockRepo.markProcessed).toHaveBeenCalledWith('outbox-1');
      expect(mockRepo.markFailed).not.toHaveBeenCalled();
    });

    it('should prevent concurrent processing when worker B claims 0 rows', async () => {
      const mockProducerA = { publish: jest.fn().mockResolvedValue([]) };
      const mockProducerB = { publish: jest.fn().mockResolvedValue([]) };

      const workerA = new OrderOutboxWorker({
        repository: mockRepo,
        kafkaProducer: mockProducerA,
        useKafka: true,
        workerId: 'order_worker_A',
      });

      mockRepo.claimBatch.mockResolvedValueOnce([
        {
          id: 'outbox-locked',
          event_type: 'order.placed',
          payload: { userId: 'u1' },
        },
      ]);

      const workerBRepo = {
        claimBatch: jest.fn().mockResolvedValueOnce([]),
        releaseExpiredLeases: jest.fn(),
      };
      const workerB = new OrderOutboxWorker({
        repository: workerBRepo,
        kafkaProducer: mockProducerB,
        useKafka: true,
        workerId: 'order_worker_B',
      });

      await Promise.all([
        workerA.processor.pollAndProcess(),
        workerB.processor.pollAndProcess(),
      ]);

      expect(mockProducerA.publish).toHaveBeenCalledTimes(1);
      expect(mockProducerB.publish).not.toHaveBeenCalled();
    });
  });
});
