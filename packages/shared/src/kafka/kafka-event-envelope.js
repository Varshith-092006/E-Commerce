import { v4 as uuidv4 } from 'uuid';

export class KafkaEventEnvelope {
  /**
   * Constructs a standardized Kafka event envelope
   */
  static create({
    eventId = uuidv4(),
    eventType,
    eventVersion = 1,
    occurredAt = new Date().toISOString(),
    sourceService = 'unknown-svc',
    aggregateType = 'unknown',
    aggregateId = '',
    correlationId = uuidv4(),
    traceId = uuidv4(),
    requestId = uuidv4(),
    idempotencyKey = eventId,
    payload = {},
  } = {}) {
    if (!eventType) {
      throw new Error('KafkaEventEnvelope requires eventType');
    }

    return {
      eventId,
      eventType,
      eventVersion,
      occurredAt,
      sourceService,
      aggregateType,
      aggregateId,
      correlationId,
      traceId,
      requestId,
      idempotencyKey,
      payload,
    };
  }

  /**
   * Validates if an object conforms to the KafkaEventEnvelope schema
   */
  static validate(envelope) {
    if (!envelope || typeof envelope !== 'object') {
      return false;
    }
    return Boolean(envelope.eventId && envelope.eventType && envelope.payload);
  }
}
