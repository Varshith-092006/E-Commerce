import { jest, describe, it, expect, beforeEach } from '@jest/globals';

import {
  KafkaClient,
  KafkaProducer,
  KafkaConsumerGroup,
  KafkaEventEnvelope,
  KafkaTopics,
  KafkaConsumerGroups,
  KafkaPublishError,
  metricsRegistry,
  OutboxProcessor,
} from '../../src/index.js';

describe('Phase 4: Kafka Scalability & Event-Stream Hardening', () => {
  beforeEach(() => {
    metricsRegistry.reset();
  });

  describe('4.1 & 4.2: Topic Inventory & Deterministic Partition Keying', () => {
    it('defines standard production topics with 3 partitions and standard consumer groups', () => {
      expect(KafkaTopics.ORDER_EVENTS).toBe('ecommerce.order-events');
      expect(KafkaTopics.PAYMENT_EVENTS).toBe('ecommerce.payment-events');
      expect(KafkaTopics.FULFILLMENT_EVENTS).toBe('ecommerce.fulfillment-events');
      expect(KafkaTopics.NOTIFICATION_EVENTS).toBe('ecommerce.notification-events');
      expect(KafkaTopics.DEAD_LETTER_EVENTS).toBe('ecommerce.dead-letter-events');
      expect(KafkaTopics.REVIEW_EVENTS).toBe('ecommerce.review-events');

      expect(KafkaConsumerGroups.ORDER_SAGA).toBe('order-saga-group');
      expect(KafkaConsumerGroups.PAYMENT_RETURN).toBe('payment-return-group');
      expect(KafkaConsumerGroups.FULFILLMENT_ORDER).toBe('fulfillment-order-group');
      expect(KafkaConsumerGroups.NOTIFICATION).toBe('notification-group');
    });

    it('consistently maps same aggregate ID to the exact same deterministic partition key', async () => {
      const mockProducerInstance = {
        connect: jest.fn().mockResolvedValue(),
        send: jest.fn().mockResolvedValue([{ partition: 1, baseOffset: '100' }]),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({
          producer: () => mockProducerInstance,
        }),
      };

      const producer = new KafkaProducer({ client: mockClient, serviceName: 'test-svc' });
      await producer.connect();

      const orderId = 'order-uuid-9999';

      // Publish multiple events for the same order
      for (const eventType of ['order.created', 'order.confirmed', 'payment.captured', 'fulfillment.started']) {
        const envelope = KafkaEventEnvelope.create({
          eventType,
          aggregateId: orderId,
          payload: { orderId, status: eventType },
        });

        await producer.publish({
          topic: KafkaTopics.ORDER_EVENTS,
          key: orderId,
          eventEnvelope: envelope,
        });
      }

      expect(mockProducerInstance.send).toHaveBeenCalledTimes(4);
      // Verify every call used key = 'order-uuid-9999'
      for (let i = 0; i < 4; i++) {
        const sendArgs = mockProducerInstance.send.mock.calls[i][0];
        expect(sendArgs.messages[0].key).toBe(orderId);
      }
    });

    it('falls back to aggregateId or eventId if key is omitted, ensuring no random partitioning', async () => {
      const mockProducerInstance = {
        connect: jest.fn().mockResolvedValue(),
        send: jest.fn().mockResolvedValue([{ partition: 2, baseOffset: '105' }]),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({ producer: () => mockProducerInstance }),
      };

      const producer = new KafkaProducer({ client: mockClient, serviceName: 'test-svc' });
      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        aggregateId: 'ord-deterministic-77',
        payload: { test: true },
      });

      await producer.publish({
        topic: KafkaTopics.ORDER_EVENTS,
        eventEnvelope: envelope,
      });

      const sendArgs = mockProducerInstance.send.mock.calls[0][0];
      expect(sendArgs.messages[0].key).toBe('ord-deterministic-77');
    });
  });

  describe('4.3: Hardened Producer & Bounded Retries', () => {
    it('configures idempotent producer with acks=all, maxInFlightRequests=1, and transactionTimeout', async () => {
      const mockProducerBuilder = jest.fn().mockReturnValue({
        connect: jest.fn().mockResolvedValue(),
        send: jest.fn().mockResolvedValue([{ partition: 0, baseOffset: '0' }]),
        disconnect: jest.fn().mockResolvedValue(),
      });
      const mockClient = {
        getKafkaInstance: () => ({ producer: mockProducerBuilder }),
      };

      const producer = new KafkaProducer({ client: mockClient, serviceName: 'order-svc' });
      await producer.connect();

      expect(mockProducerBuilder).toHaveBeenCalledWith(
        expect.objectContaining({
          allowAutoTopicCreation: false,
          idempotent: true,
          maxInFlightRequests: 1,
          transactionTimeout: 30000,
        }),
      );
    });

    it('retries transient publish errors with exponential backoff and jitter, eventually throwing KafkaPublishError', async () => {
      let callCount = 0;
      const mockProducerInstance = {
        connect: jest.fn().mockResolvedValue(),
        send: jest.fn().mockImplementation(() => {
          callCount++;
          return Promise.reject(new Error('Broker leader election in progress'));
        }),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({ producer: () => mockProducerInstance }),
      };

      const producer = new KafkaProducer({
        client: mockClient,
        serviceName: 'order-svc',
        maxRetries: 2,
        baseRetryMs: 10,
      });

      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        aggregateId: 'ord-fail-1',
        payload: { amount: 100 },
      });

      await expect(
        producer.publish({
          topic: KafkaTopics.ORDER_EVENTS,
          key: 'ord-fail-1',
          eventEnvelope: envelope,
        }),
      ).rejects.toThrow(KafkaPublishError);

      // 1 initial + 2 retries = 3 calls
      expect(callCount).toBe(3);
    });

    it('leaves outbox record intact on publish failure so it can be retried', async () => {
      const mockRepo = {
        claimBatch: jest.fn().mockResolvedValueOnce([
          {
            id: 'outbox-fail-preserve',
            event_type: 'order.placed',
            retry_count: 0,
            payload: { orderId: 'ord-preserve-1' },
          },
        ]),
        markProcessed: jest.fn(),
        markFailed: jest.fn().mockResolvedValue(),
        releaseExpiredLeases: jest.fn(),
      };

      const mockProducer = {
        publish: jest.fn().mockRejectedValue(new KafkaPublishError('Kafka cluster unreachable')),
      };

      const processor = new OutboxProcessor({
        repository: mockRepo,
        processEvent: async (event) => {
          await mockProducer.publish({
            topic: KafkaTopics.ORDER_EVENTS,
            key: event.payload.orderId,
            eventEnvelope: KafkaEventEnvelope.create({
              eventType: event.event_type,
              aggregateId: event.payload.orderId,
              payload: event.payload,
            }),
          });
        },
        workerId: 'test-outbox-worker',
        maxAttempts: 3,
        baseRetryMs: 10,
      });

      await processor.pollAndProcess();

      // Ensure outbox event is NOT marked processed or deleted
      expect(mockRepo.markProcessed).not.toHaveBeenCalled();
      // Ensure outbox event is marked failed with scheduled nextRetryAt
      expect(mockRepo.markFailed).toHaveBeenCalledWith(
        'outbox-fail-preserve',
        expect.objectContaining({
          retryCount: 1,
          nextRetryAt: expect.any(Date),
          isPermanent: false,
        }),
      );
    });
  });

  describe('4.4 & 4.5: Consumer Concurrency, Heartbeat Safety & Slow Handlers', () => {
    it('configures consumer concurrency bounded by partition limits and MAX_KAFKA_CONCURRENCY', async () => {
      const mockConsumer = {
        connect: jest.fn().mockResolvedValue(),
        subscribe: jest.fn().mockResolvedValue(),
        run: jest.fn().mockResolvedValue(),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({ consumer: () => mockConsumer }),
      };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'order-saga-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler: async () => {},
        client: mockClient,
        maxConcurrency: 5,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxWaitTimeInMs: 500,
      });

      await consumerGroup.start();

      expect(mockConsumer.run).toHaveBeenCalledWith(
        expect.objectContaining({
          autoCommit: false,
          partitionsConsumedConcurrently: 3, // Math.min(3, 5)
        }),
      );
    });

    it('passes heartbeat callback to handler so slow handlers avoid rebalances', async () => {
      const heartbeatMock = jest.fn().mockResolvedValue();
      let capturedHeartbeat = null;

      const handler = jest.fn().mockImplementation(async ({ heartbeat }) => {
        capturedHeartbeat = heartbeat;
        if (typeof heartbeat === 'function') {
          await heartbeat();
        }
        return { status: 'DONE' };
      });

      const mockConsumer = {
        commitOffsets: jest.fn().mockResolvedValue(),
      };
      const mockClient = { getKafkaInstance: () => ({}) };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'slow-handler-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler,
        client: mockClient,
      });
      consumerGroup.consumer = mockConsumer;

      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        aggregateId: 'ord-slow',
        payload: { slow: true },
      });

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '10', value: Buffer.from(JSON.stringify(envelope)) },
        heartbeat: heartbeatMock,
      });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(capturedHeartbeat).toBeDefined();
      expect(heartbeatMock).toHaveBeenCalledTimes(1);
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '11' },
      ]);
    });
  });

  describe('4.6: Idempotent Event Consumption', () => {
    it('detects duplicate events, executes handler exactly once, and acknowledges second delivery safely', async () => {
      const processedStore = new Set();
      let businessMutationCount = 0;

      const idempotentHandler = jest.fn().mockImplementation(async ({ event }) => {
        const { eventId } = event;
        if (processedStore.has(eventId)) {
          return { status: 'SKIPPED_DUPLICATE', eventId };
        }
        processedStore.add(eventId);
        businessMutationCount++;
        return { status: 'PROCESSED', eventId };
      });

      const mockConsumer = {
        commitOffsets: jest.fn().mockResolvedValue(),
      };
      const mockClient = { getKafkaInstance: () => ({}) };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'idempotent-test-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler: idempotentHandler,
        client: mockClient,
      });
      consumerGroup.consumer = mockConsumer;

      const envelope = KafkaEventEnvelope.create({
        eventId: 'stable-evt-uuid-1234',
        eventType: 'order.placed',
        aggregateId: 'ord-55',
        payload: { orderId: 'ord-55', total: 200 },
      });

      // Delivery 1
      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '20', value: Buffer.from(JSON.stringify(envelope)) },
      });

      // Delivery 2 (same eventId, same payload)
      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '21', value: Buffer.from(JSON.stringify(envelope)) },
      });

      expect(idempotentHandler).toHaveBeenCalledTimes(2);
      expect(businessMutationCount).toBe(1); // Exactly once business mutation
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '21' },
      ]);
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '22' },
      ]);
    });
  });

  describe('4.7: Transactional Outbox Worker Multi-Replica Safety', () => {
    it('prevents concurrent replicas from claiming and processing the same outbox rows', async () => {
      const databaseRows = [
        { id: 'row-1', status: 'PENDING', locked_at: null, locked_by: null },
        { id: 'row-2', status: 'PENDING', locked_at: null, locked_by: null },
      ];

      // Concurrency-safe claimBatch simulation (mimicking SELECT FOR UPDATE SKIP LOCKED / conditional atomic lease)
      const claimBatchMock = jest.fn().mockImplementation(({ workerId, batchSize }) => {
        const available = databaseRows.filter((r) => r.status === 'PENDING').slice(0, batchSize);
        available.forEach((r) => {
          r.status = 'PROCESSING';
          r.locked_by = workerId;
          r.locked_at = new Date();
        });
        return Promise.resolve(available);
      });

      const repoA = { claimBatch: claimBatchMock, markProcessed: jest.fn(), releaseExpiredLeases: jest.fn() };
      const repoB = { claimBatch: claimBatchMock, markProcessed: jest.fn(), releaseExpiredLeases: jest.fn() };

      const processedA = [];
      const processedB = [];

      const workerA = new OutboxProcessor({
        repository: repoA,
        processEvent: async (event) => processedA.push(event.id),
        workerId: 'worker-replica-1',
        batchSize: 2,
      });

      const workerB = new OutboxProcessor({
        repository: repoB,
        processEvent: async (event) => processedB.push(event.id),
        workerId: 'worker-replica-2',
        batchSize: 2,
      });

      // Both workers poll simultaneously
      await Promise.all([workerA.pollAndProcess(), workerB.pollAndProcess()]);

      // All rows processed, but zero overlap between worker A and worker B
      expect(processedA.length + processedB.length).toBe(2);
      const overlap = processedA.filter((id) => processedB.includes(id));
      expect(overlap).toEqual([]);
    });

    it('recovers stale leases exceeding 30,000ms threshold', async () => {
      const staleDate = new Date(Date.now() - 35000);
      const rows = [
        { id: 'row-stale', status: 'PROCESSING', locked_at: staleDate, locked_by: 'dead-worker' },
      ];

      const releaseExpiredLeases = jest.fn().mockImplementation((timeoutMs) => {
        const threshold = new Date(Date.now() - timeoutMs);
        rows.forEach((r) => {
          if (r.status === 'PROCESSING' && r.locked_at < threshold) {
            r.status = 'PENDING';
            r.locked_at = null;
            r.locked_by = null;
          }
        });
        return Promise.resolve();
      });

      const repo = {
        releaseExpiredLeases,
        claimBatch: jest.fn().mockResolvedValue([]),
      };

      const worker = new OutboxProcessor({
        repository: repo,
        processEvent: async () => {},
        workerId: 'worker-recovery',
        lockTimeoutMs: 30000,
      });

      await worker.pollAndProcess();

      expect(releaseExpiredLeases).toHaveBeenCalledWith(30000);
      expect(rows[0].status).toBe('PENDING');
      expect(rows[0].locked_by).toBeNull();
    });
  });

  describe('4.9: Dead Letter Queue (DLQ) Envelope & Controlled Replay', () => {
    it('preserves complete original envelope and debugging metadata in DLQ record', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Fatal database constraint violated'));
      const mockConsumer = { commitOffsets: jest.fn().mockResolvedValue() };
      const mockDlqProducer = { publish: jest.fn().mockResolvedValue([{ partition: 0, baseOffset: '50' }]) };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'dlq-test-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler,
        client: { getKafkaInstance: () => ({}) },
        dlqProducer: mockDlqProducer,
        maxRetries: 1,
        serviceName: 'order-svc',
      });
      consumerGroup.consumer = mockConsumer;

      const originalEnvelope = KafkaEventEnvelope.create({
        eventId: 'orig-evt-88',
        eventType: 'order.placed',
        eventVersion: 1,
        aggregateId: 'ord-88',
        payload: { orderId: 'ord-88', items: [1, 2] },
      });

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 1,
        message: { offset: '42', value: Buffer.from(JSON.stringify(originalEnvelope)) },
      });

      expect(mockDlqProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: KafkaTopics.DEAD_LETTER_EVENTS,
          key: KafkaTopics.ORDER_EVENTS,
          eventEnvelope: expect.objectContaining({
            eventType: 'event.failed_max_retries',
            aggregateId: 'ord-88',
            eventVersion: 1,
            payload: expect.objectContaining({
              originalTopic: KafkaTopics.ORDER_EVENTS,
              originalPartition: 1,
              originalOffset: '42',
              consumerGroup: 'dlq-test-group',
              failureReason: 'RETRY_EXHAUSTED',
              errorMessage: 'Fatal database constraint violated',
              originalEnvelope: expect.objectContaining({ eventId: 'orig-evt-88' }),
            }),
          }),
        }),
      );
    });

    it('routes malformed JSON directly to DLQ without crashing consumer loop', async () => {
      const mockConsumer = { commitOffsets: jest.fn().mockResolvedValue() };
      const mockDlqProducer = { publish: jest.fn().mockResolvedValue() };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'malformed-test-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler: jest.fn(),
        client: { getKafkaInstance: () => ({}) },
        dlqProducer: mockDlqProducer,
      });
      consumerGroup.consumer = mockConsumer;

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '99', value: Buffer.from('{ corrupt-json-broken') },
      });

      expect(mockDlqProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: KafkaTopics.DEAD_LETTER_EVENTS,
          eventEnvelope: expect.objectContaining({
            payload: expect.objectContaining({
              failureReason: 'MALFORMED_JSON',
              rawPayload: '{ corrupt-json-broken',
            }),
          }),
        }),
      );
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '100' },
      ]);
    });
  });

  describe('4.10 & 4.11: Event Versioning & Schema Validation', () => {
    it('accepts supported eventVersion (1 / "1.0") and processes normally', async () => {
      const handler = jest.fn().mockResolvedValue({ status: 'OK' });
      const mockConsumer = { commitOffsets: jest.fn().mockResolvedValue() };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'version-test-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler,
        client: { getKafkaInstance: () => ({}) },
        supportedVersions: [1],
      });
      consumerGroup.consumer = mockConsumer;

      const envelopeV1 = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        eventVersion: 1,
        aggregateId: 'ord-v1',
        payload: { valid: true },
      });

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '1', value: Buffer.from(JSON.stringify(envelopeV1)) },
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('routes unsupported eventVersion (e.g. 99) to DLQ without crashing consumer loop', async () => {
      const handler = jest.fn();
      const mockDlqProducer = { publish: jest.fn().mockResolvedValue() };
      const mockConsumer = { commitOffsets: jest.fn().mockResolvedValue() };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'unsupported-version-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler,
        client: { getKafkaInstance: () => ({}) },
        dlqProducer: mockDlqProducer,
        supportedVersions: [1],
      });
      consumerGroup.consumer = mockConsumer;

      const envelopeV99 = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        eventVersion: 99,
        aggregateId: 'ord-v99',
        payload: { futureSchema: true },
      });

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '2', value: Buffer.from(JSON.stringify(envelopeV99)) },
      });

      expect(handler).not.toHaveBeenCalled();
      expect(mockDlqProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: KafkaTopics.DEAD_LETTER_EVENTS,
          eventEnvelope: expect.objectContaining({
            payload: expect.objectContaining({
              failureReason: 'UNSUPPORTED_EVENT_VERSION',
            }),
          }),
        }),
      );
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '3' },
      ]);
    });

    it('routes envelope missing required schema fields to DLQ', async () => {
      const handler = jest.fn();
      const mockDlqProducer = { publish: jest.fn().mockResolvedValue() };
      const mockConsumer = { commitOffsets: jest.fn().mockResolvedValue() };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'schema-validation-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler,
        client: { getKafkaInstance: () => ({}) },
        dlqProducer: mockDlqProducer,
      });
      consumerGroup.consumer = mockConsumer;

      // Missing eventType and payload
      const brokenEnvelope = { eventId: 'broken-evt' };

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '3', value: Buffer.from(JSON.stringify(brokenEnvelope)) },
      });

      expect(handler).not.toHaveBeenCalled();
      expect(mockDlqProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: KafkaTopics.DEAD_LETTER_EVENTS,
          eventEnvelope: expect.objectContaining({
            payload: expect.objectContaining({
              failureReason: 'SCHEMA_VALIDATION_FAILED',
            }),
          }),
        }),
      );
    });
  });

  describe('4.12: Prometheus Metrics & Consumer Lag Visibility', () => {
    it('records first-class Prometheus metrics for lag, records processed, retries, and DLQ without high-cardinality IDs', async () => {
      const mockConsumer = { commitOffsets: jest.fn().mockResolvedValue() };
      const mockDlqProducer = { publish: jest.fn().mockResolvedValue() };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'metrics-test-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler: jest.fn().mockResolvedValue({ ok: true }),
        client: { getKafkaInstance: () => ({}) },
        dlqProducer: mockDlqProducer,
        serviceName: 'order-svc',
      });
      consumerGroup.consumer = mockConsumer;

      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        aggregateId: 'ord-m1',
        payload: { ok: true },
      });

      // Update lag metric
      consumerGroup.updateLagMetrics(KafkaTopics.ORDER_EVENTS, 0, 42);

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: { offset: '100', value: Buffer.from(JSON.stringify(envelope)) },
      });

      const promOutput = metricsRegistry.toPrometheusText();

      // Verify standardized metrics exist
      expect(promOutput).toContain('kafka_consumer_lag');
      expect(promOutput).toContain('kafka_consumer_partition_lag');
      expect(promOutput).toContain('kafka_consumer_records_processed_total');

      // Verify values
      expect(promOutput).toContain('kafka_consumer_partition_lag{service="order-svc",topic="ecommerce.order-events",partition="0",consumer_group="metrics-test-group"} 42');
      expect(promOutput).toContain('kafka_consumer_records_processed_total{service="order-svc",topic="ecommerce.order-events",consumer_group="metrics-test-group"} 1');

      // Verify NO high-cardinality labels (no eventId, orderId, userId)
      expect(promOutput).not.toContain('eventId="');
      expect(promOutput).not.toContain('orderId="');
      expect(promOutput).not.toContain('userId="');
    });
  });
});
