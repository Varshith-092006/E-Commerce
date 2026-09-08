import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect, jest } from '@jest/globals';
import {
  KafkaEventEnvelope,
  assertValidEnvelope,
  validatePayloadContract,
  EVENT_PAYLOAD_CONTRACTS,
  KafkaConsumerGroup,
  KafkaTopics,
} from '../../src/kafka/index.js';

describe('Phase 11: Kafka Event Schema Governance & Compatibility', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // A. Envelope Compliance Across Active Producers
  // ───────────────────────────────────────────────────────────────────────────
  describe('A. Active Producer Envelope Compliance', () => {
    it('creates compliant envelope for order-svc (order.placed)', () => {
      const envelope = KafkaEventEnvelope.create({
        eventId: 'evt-ord-1',
        eventType: 'order.placed',
        eventVersion: 1,
        sourceService: 'order-svc',
        aggregateType: 'order',
        aggregateId: 'order-12345',
        payload: {
          orderId: 'order-12345',
          customerId: 'cust-99',
          totalAmount: 149.99,
          items: [{ productId: 'prod-1', quantity: 2 }],
        },
      });

      expect(KafkaEventEnvelope.validate(envelope)).toBe(true);
      expect(() => assertValidEnvelope(envelope)).not.toThrow();
      expect(envelope.eventVersion).toBe(1);
    });

    it('creates compliant envelope for payment-svc (payment.captured)', () => {
      const envelope = KafkaEventEnvelope.create({
        eventId: 'evt-pay-1',
        eventType: 'payment.captured',
        eventVersion: 1,
        sourceService: 'payment-svc',
        aggregateType: 'payment',
        aggregateId: 'order-12345',
        payload: {
          paymentId: 'pay-uuid-77',
          orderId: 'order-12345',
          amount: 149.99,
          currency: 'INR',
          razorpayPaymentId: 'pay_test123',
        },
      });

      expect(KafkaEventEnvelope.validate(envelope)).toBe(true);
      expect(() => assertValidEnvelope(envelope)).not.toThrow();
    });

    it('creates compliant envelope for fulfillment-svc (shipment.shipped)', () => {
      const envelope = KafkaEventEnvelope.create({
        eventId: 'evt-ful-1',
        eventType: 'shipment.shipped',
        eventVersion: 1,
        sourceService: 'fulfillment-svc',
        aggregateType: 'fulfillment',
        aggregateId: 'order-12345',
        payload: {
          orderId: 'order-12345',
          shipmentId: 'ship-44',
          trackingNumber: 'TRACK-888',
        },
      });

      expect(KafkaEventEnvelope.validate(envelope)).toBe(true);
      expect(() => assertValidEnvelope(envelope)).not.toThrow();
    });

    it('creates compliant envelope for catalog-svc (review.created)', () => {
      const envelope = KafkaEventEnvelope.create({
        eventId: 'evt-cat-1',
        eventType: 'review.created',
        eventVersion: 1,
        sourceService: 'catalog-svc',
        aggregateType: 'ProductReview',
        aggregateId: 'prod-100',
        payload: {
          productId: 'prod-100',
          rating: 5,
          reviewId: 'rev-1',
        },
      });

      expect(KafkaEventEnvelope.validate(envelope)).toBe(true);
      expect(() => assertValidEnvelope(envelope)).not.toThrow();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // B. Required Envelope Metadata Validation
  // ───────────────────────────────────────────────────────────────────────────
  describe('B. Required Envelope Metadata Enforcement', () => {
    const validBase = {
      eventId: 'evt-1',
      eventType: 'order.placed',
      occurredAt: '2026-09-08T00:00:00.000Z',
      eventVersion: 1,
      sourceService: 'order-svc',
      aggregateType: 'order',
      aggregateId: 'ord-123',
      payload: { orderId: 'ord-123', totalAmount: 50 },
    };

    it('rejects null or non-object envelopes', () => {
      expect(KafkaEventEnvelope.validate(null)).toBe(false);
      expect(KafkaEventEnvelope.validate(undefined)).toBe(false);
      expect(KafkaEventEnvelope.validate('string')).toBe(false);
      expect(KafkaEventEnvelope.validate([])).toBe(false);
      expect(() => assertValidEnvelope(null)).toThrow(/must be a non-null object/);
    });

    it('rejects missing or empty eventId', () => {
      const invalid = { ...validBase, eventId: '' };
      expect(KafkaEventEnvelope.validate(invalid)).toBe(false);
      expect(() => assertValidEnvelope(invalid)).toThrow(/missing or invalid eventId/);
    });

    it('rejects missing or empty eventType', () => {
      const invalid = { ...validBase, eventType: '   ' };
      expect(KafkaEventEnvelope.validate(invalid)).toBe(false);
      expect(() => assertValidEnvelope(invalid)).toThrow(/missing or invalid eventType/);
    });

    it('rejects missing or empty occurredAt', () => {
      const invalid = { ...validBase, occurredAt: null };
      expect(KafkaEventEnvelope.validate(invalid)).toBe(false);
      expect(() => assertValidEnvelope(invalid)).toThrow(/missing or invalid occurredAt/);
    });

    it('rejects missing or non-positive integer eventVersion', () => {
      expect(KafkaEventEnvelope.validate({ ...validBase, eventVersion: null })).toBe(false);
      expect(KafkaEventEnvelope.validate({ ...validBase, eventVersion: -1 })).toBe(false);
      expect(KafkaEventEnvelope.validate({ ...validBase, eventVersion: 1.5 })).toBe(false);
      expect(KafkaEventEnvelope.validate({ ...validBase, eventVersion: 'abc' })).toBe(false);
      expect(() => assertValidEnvelope({ ...validBase, eventVersion: 0 })).toThrow(
        /missing or invalid eventVersion/,
      );
    });

    it('rejects missing or empty sourceService', () => {
      const invalid = { ...validBase, sourceService: '' };
      expect(KafkaEventEnvelope.validate(invalid)).toBe(false);
      expect(() => assertValidEnvelope(invalid)).toThrow(/missing or invalid sourceService/);
    });

    it('rejects missing or empty aggregateType', () => {
      const invalid = { ...validBase, aggregateType: ' ' };
      expect(KafkaEventEnvelope.validate(invalid)).toBe(false);
      expect(() => assertValidEnvelope(invalid)).toThrow(/missing or invalid aggregateType/);
    });

    it('rejects missing or empty aggregateId', () => {
      const invalid = { ...validBase, aggregateId: '' };
      expect(KafkaEventEnvelope.validate(invalid)).toBe(false);
      expect(() => assertValidEnvelope(invalid)).toThrow(/missing or invalid aggregateId/);
    });

    it('rejects missing, null, or array payload', () => {
      expect(KafkaEventEnvelope.validate({ ...validBase, payload: null })).toBe(false);
      expect(KafkaEventEnvelope.validate({ ...validBase, payload: 'invalid' })).toBe(false);
      expect(KafkaEventEnvelope.validate({ ...validBase, payload: [1, 2] })).toBe(false);
      expect(() => assertValidEnvelope({ ...validBase, payload: null })).toThrow(
        /missing or invalid payload/,
      );
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // C. Version Support & Rejection
  // ───────────────────────────────────────────────────────────────────────────
  describe('C. Version Compatibility & Rejection', () => {
    it('accepts supported version 1', () => {
      const envelope = { eventVersion: 1 };
      expect(KafkaEventEnvelope.validateVersion(envelope, [1])).toBe(true);
    });

    it('rejects unsupported versions such as 99', () => {
      const envelope = { eventVersion: 99 };
      expect(KafkaEventEnvelope.validateVersion(envelope, [1])).toBe(false);
    });

    it('supports multiple active versions where configured ([1, 2])', () => {
      expect(KafkaEventEnvelope.validateVersion({ eventVersion: 1 }, [1, 2])).toBe(true);
      expect(KafkaEventEnvelope.validateVersion({ eventVersion: 2 }, [1, 2])).toBe(true);
      expect(KafkaEventEnvelope.validateVersion({ eventVersion: 3 }, [1, 2])).toBe(false);
    });

    it('handles string version representations safely', () => {
      expect(KafkaEventEnvelope.validateVersion({ eventVersion: '1' }, [1])).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // D. Tolerant Reader Pattern
  // ───────────────────────────────────────────────────────────────────────────
  describe('D. Tolerant Reader Compliance', () => {
    it('allows unknown additive fields in payload without failure', () => {
      const payloadWithFutureFields = {
        orderId: 'ord-12345',
        totalAmount: 99.99,
        promotionCode: 'SAVE20',
        loyaltyTier: 'PLATINUM',
        customMetadata: { experimentGroup: 'B' },
      };

      const result = validatePayloadContract('order.placed', payloadWithFutureFields, 1);
      expect(result.valid).toBe(true);
      expect(result.governed).toBe(true);
    });

    it('preserves additive fields inside the envelope object untouched', () => {
      const envelope = KafkaEventEnvelope.create({
        eventId: 'evt-1',
        eventType: 'order.placed',
        eventVersion: 1,
        sourceService: 'order-svc',
        aggregateType: 'order',
        aggregateId: 'ord-12345',
        payload: {
          orderId: 'ord-12345',
          totalAmount: 100,
          futureFeatureFlag: true,
        },
      });

      expect(envelope.payload.futureFeatureFlag).toBe(true);
      expect(KafkaEventEnvelope.validate(envelope)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // E. Payload Contract Validation
  // ───────────────────────────────────────────────────────────────────────────
  describe('E. Lightweight Payload Contract Validation', () => {
    it('passes valid payloads for governed event types', () => {
      expect(
        validatePayloadContract('order.placed', { orderId: 'ord-1', totalAmount: 10 }).valid,
      ).toBe(true);
      expect(
        validatePayloadContract('payment.captured', {
          paymentId: 'p-1',
          orderId: 'o-1',
          amount: 50,
        }).valid,
      ).toBe(true);
      expect(
        validatePayloadContract('shipment.shipped', { orderId: 'o-1', trackingNumber: 'TRK-1' })
          .valid,
      ).toBe(true);
      expect(
        validatePayloadContract('review.created', { productId: 'prod-9', rating: 5 }).valid,
      ).toBe(true);
    });

    it('supports snake_case aliases used by database entities', () => {
      const snakePayload = {
        order_id: 'ord-55',
        total_amount: 199.99,
      };
      expect(validatePayloadContract('order.placed', snakePayload, 1).valid).toBe(true);
    });

    it('flags missing required payload fields', () => {
      const incomplete = { orderId: 'ord-1' }; // missing totalAmount
      const check = validatePayloadContract('order.placed', incomplete, 1);
      expect(check.valid).toBe(false);
      expect(check.missingFields).toContain('totalAmount');
      expect(check.error).toMatch(/missing required fields/);
    });

    it('rejects unsupported eventVersion in payload contracts', () => {
      const check = validatePayloadContract(
        'order.placed',
        { orderId: 'ord-1', totalAmount: 10 },
        99,
      );
      expect(check.valid).toBe(false);
      expect(check.error).toMatch(/Unsupported eventVersion 99/);
    });

    it('treats ungoverned event types as non-breaking valid pass-through', () => {
      const check = validatePayloadContract('custom.unregistered.event', { customData: 123 }, 1);
      expect(check.valid).toBe(true);
      expect(check.governed).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F. Partition Identity & Key Consistency
  // ───────────────────────────────────────────────────────────────────────────
  describe('F. Partition Key Mapping Governance', () => {
    it('verifies that orderId is used as key for order and payment domain events', () => {
      const orderId = 'ord-partition-key-777';
      const envelope = KafkaEventEnvelope.create({
        eventType: 'order.placed',
        aggregateType: 'order',
        aggregateId: orderId,
        payload: { orderId },
      });

      const partitionKey = envelope.aggregateId;
      expect(partitionKey).toBe(orderId);
    });

    it('verifies that productId is used as key for review domain events', () => {
      const productId = 'prod-partition-key-888';
      const envelope = KafkaEventEnvelope.create({
        eventType: 'review.created',
        aggregateType: 'ProductReview',
        aggregateId: productId,
        payload: { productId, rating: 5 },
      });

      const partitionKey = envelope.aggregateId;
      expect(partitionKey).toBe(productId);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // G. DLQ Routing for Schema Violations & Unsupported Versions
  // ───────────────────────────────────────────────────────────────────────────
  describe('G. DLQ Handling for Governance Violations', () => {
    it('routes schema-invalid message to DLQ and commits offset without crashing', async () => {
      const mockProducer = {
        connect: jest.fn().mockResolvedValue(),
        send: jest.fn().mockResolvedValue([{ partition: 0, baseOffset: '500' }]),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockConsumer = {
        connect: jest.fn().mockResolvedValue(),
        subscribe: jest.fn().mockResolvedValue(),
        run: jest.fn().mockResolvedValue(),
        disconnect: jest.fn().mockResolvedValue(),
        commitOffsets: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({
          producer: () => mockProducer,
          consumer: () => mockConsumer,
        }),
      };

      const handlerMock = jest.fn();
      const consumerGroup = new KafkaConsumerGroup({
        client: mockClient,
        groupId: 'test-governance-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler: handlerMock,
        supportedVersions: [1],
      });
      consumerGroup.consumer = mockConsumer;

      // Message missing required eventVersion and aggregateId
      const malformedMessage = {
        offset: '10',
        value: Buffer.from(
          JSON.stringify({
            eventId: 'bad-evt-1',
            eventType: 'order.placed',
            payload: {},
          }),
        ),
      };

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: malformedMessage,
      });

      // Business handler must NOT have been called
      expect(handlerMock).not.toHaveBeenCalled();

      // DLQ producer must have been called with DEAD_LETTER_EVENTS topic
      expect(mockProducer.send).toHaveBeenCalled();
      const sentPayload = JSON.parse(mockProducer.send.mock.calls[0][0].messages[0].value);
      expect(sentPayload.payload.failureReason).toBe('SCHEMA_VALIDATION_FAILED');

      // Offset must be committed to avoid poison pill loop
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '11' },
      ]);
    });

    it('routes unsupported eventVersion (e.g. 99) to DLQ and commits offset', async () => {
      const mockProducer = {
        connect: jest.fn().mockResolvedValue(),
        send: jest.fn().mockResolvedValue([{ partition: 0, baseOffset: '501' }]),
        disconnect: jest.fn().mockResolvedValue(),
      };
      const mockConsumer = {
        connect: jest.fn().mockResolvedValue(),
        subscribe: jest.fn().mockResolvedValue(),
        run: jest.fn().mockResolvedValue(),
        disconnect: jest.fn().mockResolvedValue(),
        commitOffsets: jest.fn().mockResolvedValue(),
      };
      const mockClient = {
        getKafkaInstance: () => ({
          producer: () => mockProducer,
          consumer: () => mockConsumer,
        }),
      };

      const handlerMock = jest.fn();
      const consumerGroup = new KafkaConsumerGroup({
        client: mockClient,
        groupId: 'test-governance-group',
        topics: [KafkaTopics.ORDER_EVENTS],
        handler: handlerMock,
        supportedVersions: [1],
      });
      consumerGroup.consumer = mockConsumer;

      const unsupportedVersionEnvelope = {
        eventId: 'unsupported-ver-1',
        eventType: 'order.placed',
        eventVersion: 99,
        occurredAt: new Date().toISOString(),
        sourceService: 'future-svc',
        aggregateType: 'order',
        aggregateId: 'ord-99',
        payload: { orderId: 'ord-99' },
      };

      await consumerGroup.processSingleMessage({
        topic: KafkaTopics.ORDER_EVENTS,
        partition: 0,
        message: {
          offset: '20',
          value: Buffer.from(JSON.stringify(unsupportedVersionEnvelope)),
        },
      });

      expect(handlerMock).not.toHaveBeenCalled();
      expect(mockProducer.send).toHaveBeenCalled();
      const sentPayload = JSON.parse(mockProducer.send.mock.calls[0][0].messages[0].value);
      expect(sentPayload.payload.failureReason).toBe('UNSUPPORTED_EVENT_VERSION');
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: KafkaTopics.ORDER_EVENTS, partition: 0, offset: '21' },
      ]);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // H. Documentation Consistency & Catalog Alignment
  // ───────────────────────────────────────────────────────────────────────────
  describe('H. Documentation Consistency & Catalog Alignment', () => {
    const catalogPath = path.resolve(process.cwd(), 'docs/events/EVENT-CATALOG.md');
    const versioningPath = path.resolve(process.cwd(), 'docs/events/EVENT-VERSIONING.md');

    it('verifies that EVENT-CATALOG.md and EVENT-VERSIONING.md exist', () => {
      expect(fs.existsSync(catalogPath)).toBe(true);
      expect(fs.existsSync(versioningPath)).toBe(true);
    });

    it('verifies all governed event types are documented in EVENT-CATALOG.md', () => {
      const catalogContent = fs.readFileSync(catalogPath, 'utf8');
      const governedTypes = Object.keys(EVENT_PAYLOAD_CONTRACTS);

      for (const eventType of governedTypes) {
        expect(catalogContent).toContain(eventType);
      }
    });

    it('verifies all active catalog events declare Version: 1', () => {
      const catalogContent = fs.readFileSync(catalogPath, 'utf8');
      const versionMatches = catalogContent.match(/\*\*Version:\*\*\s*`?(\d+)`?/g) || [];

      expect(versionMatches.length).toBeGreaterThan(0);
      for (const match of versionMatches) {
        expect(match).toMatch(/\*\*Version:\*\*\s*`?1`?/);
      }
    });

    it('verifies planned events are explicitly flagged as Planned / Unimplemented', () => {
      const catalogContent = fs.readFileSync(catalogPath, 'utf8');
      expect(catalogContent).toContain('Planned / Unimplemented Events');
      expect(catalogContent).toContain('order.cancellationRequested');
      expect(catalogContent).toContain('inventory.low_stock');
    });
  });
});
