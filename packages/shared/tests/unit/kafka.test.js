import { jest } from '@jest/globals';
import {
  KafkaClient,
  KafkaProducer,
  KafkaEventEnvelope,
  KafkaConsumerGroup,
  KafkaTopics,
  KafkaConsumerGroups,
} from '../../src/kafka/index.js';

describe('Kafka Shared Module Unit Tests', () => {
  describe('KafkaEventEnvelope', () => {
    it('creates a valid event envelope with default fields', () => {
      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        sourceService: 'order-svc',
        aggregateType: 'order',
        aggregateId: 'ord-123',
        payload: { userId: 'usr-1', totalAmount: '99.99' },
      });

      expect(envelope).toHaveProperty('eventId');
      expect(envelope.eventType).toBe('order.placed');
      expect(envelope.eventVersion).toBe(1);
      expect(envelope.sourceService).toBe('order-svc');
      expect(envelope.aggregateId).toBe('ord-123');
      expect(envelope.payload).toEqual({ userId: 'usr-1', totalAmount: '99.99' });
      expect(KafkaEventEnvelope.validate(envelope)).toBe(true);
    });

    it('rejects envelope creation if eventType is missing', () => {
      expect(() => KafkaEventEnvelope.create({})).toThrow('KafkaEventEnvelope requires eventType');
    });

    it('validates invalid envelope objects', () => {
      expect(KafkaEventEnvelope.validate(null)).toBe(false);
      expect(KafkaEventEnvelope.validate({})).toBe(false);
      expect(KafkaEventEnvelope.validate({ eventId: '1' })).toBe(false);
    });
  });

  describe('KafkaClient & Topics', () => {
    it('initializes KafkaClient with default broker configuration', () => {
      const client = new KafkaClient({ clientId: 'test-client', brokers: ['localhost:9092'] });
      expect(client.clientId).toBe('test-client');
      expect(client.brokers).toEqual(['localhost:9092']);
      expect(client.getKafkaInstance()).toBeDefined();
    });

    it('exposes standard Kafka topics and consumer groups', () => {
      expect(KafkaTopics.ORDER_EVENTS).toBe('ecommerce.order-events');
      expect(KafkaTopics.PAYMENT_EVENTS).toBe('ecommerce.payment-events');
      expect(KafkaTopics.FULFILLMENT_EVENTS).toBe('ecommerce.fulfillment-events');
      expect(KafkaTopics.NOTIFICATION_EVENTS).toBe('ecommerce.notification-events');
      expect(KafkaTopics.DEAD_LETTER_EVENTS).toBe('ecommerce.dead-letter-events');

      expect(KafkaConsumerGroups.FULFILLMENT_ORDER).toBe('fulfillment-order-group');
      expect(KafkaConsumerGroups.NOTIFICATION).toBe('notification-group');
    });
  });

  describe('KafkaProducer', () => {
    it('publishes event to mock producer cleanly', async () => {
      const mockProducerInstance = {
        connect: jest.fn().mockResolvedValue(),
        send: jest.fn().mockResolvedValue([{ partition: 0, baseOffset: '10' }]),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({
          producer: () => mockProducerInstance,
        }),
      };

      const producer = new KafkaProducer({ client: mockClient, serviceName: 'test-svc' });
      await producer.connect();

      const envelope = KafkaEventEnvelope.create({
        eventType: 'payment.captured',
        aggregateId: 'ord-555',
        payload: { amount: '50.00' },
      });

      const res = await producer.publish({
        topic: KafkaTopics.PAYMENT_EVENTS,
        key: 'ord-555',
        eventEnvelope: envelope,
      });

      expect(res[0].baseOffset).toBe('10');
      expect(mockProducerInstance.send).toHaveBeenCalledTimes(1);
      await producer.disconnect();
    });
  });

  describe('KafkaConsumerGroup', () => {
    it('processes message and commits offset', async () => {
      const handler = jest.fn().mockResolvedValue({ status: 'PROCESSED' });
      const mockConsumerInstance = {
        connect: jest.fn().mockResolvedValue(),
        subscribe: jest.fn().mockResolvedValue(),
        run: jest.fn(),
        commitOffsets: jest.fn().mockResolvedValue(),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({
          consumer: () => mockConsumerInstance,
        }),
      };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'test-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler,
        client: mockClient,
        serviceName: 'test-svc',
      });

      consumerGroup.consumer = mockConsumerInstance;

      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        payload: { orderId: 'ord-100' },
      });

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: {
          offset: '5',
          value: Buffer.from(JSON.stringify(envelope)),
        },
      });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(mockConsumerInstance.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '6' },
      ]);
    });

    it('routes to DLQ when max retries are exhausted', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Persistent Handler Crash'));
      const mockConsumerInstance = {
        commitOffsets: jest.fn().mockResolvedValue(),
      };
      const mockDlqProducer = {
        publish: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({}),
      };

      const consumerGroup = new KafkaConsumerGroup({
        groupId: 'test-dlq-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler,
        client: mockClient,
        dlqProducer: mockDlqProducer,
        maxRetries: 2,
        baseBackoffMs: 10,
        serviceName: 'test-svc',
      });
      consumerGroup.consumer = mockConsumerInstance;

      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        payload: { orderId: 'ord-fail' },
      });

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: {
          offset: '12',
          value: Buffer.from(JSON.stringify(envelope)),
        },
      });

      expect(handler).toHaveBeenCalledTimes(2);
      expect(mockDlqProducer.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: KafkaTopics.DEAD_LETTER_EVENTS,
        }),
      );
      expect(mockConsumerInstance.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '13' },
      ]);
    });
  });
});
