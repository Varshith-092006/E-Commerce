import { jest } from '@jest/globals';

import { FulfillmentOutboxWorker } from '../../src/workers/fulfillment-outbox.worker.js';

describe('FulfillmentOutboxWorker Unit Tests', () => {
  let worker;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      claimBatch: jest.fn().mockResolvedValue([]),
      markProcessed: jest.fn().mockResolvedValue({ status: 'PROCESSED' }),
      scheduleRetry: jest.fn(),
      markDeadLetter: jest.fn(),
    };

    const mockKafkaProducer = {
      connect: jest.fn().mockResolvedValue(),
      publish: jest.fn().mockResolvedValue({ partition: 0, offset: '1' }),
      disconnect: jest.fn().mockResolvedValue(),
    };

    worker = new FulfillmentOutboxWorker({
      repository: mockRepo,
      kafkaProducer: mockKafkaProducer,
      workerId: 'test_fulfillment_worker',
    });
  });

  test('processes shipment event and forwards to notification-svc', async () => {
    const event = {
      id: 'outbox-shp-1',
      event_type: 'shipment.shipped',
      payload: {
        orderId: 'ord-100',
        trackingNumber: 'TRK-100',
        userId: 'user-100',
      },
    };

    const result = await worker.processEvent(event);
    expect(result.processed).toBe(true);
    expect(result.eventType).toBe('shipment.shipped');
  });
});
