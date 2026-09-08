import { v4 as uuidv4 } from 'uuid';

/**
 * Standard in-code event payload contract registry for lightweight schema governance.
 * Governs active production events across Order, Payment, Fulfillment, and Catalog/Review domains.
 */
export const EVENT_PAYLOAD_CONTRACTS = Object.freeze({
  'order.placed': {
    1: {
      required: ['orderId', 'totalAmount'],
      aliases: {
        orderId: ['order_id', 'id'],
        totalAmount: ['total_amount', 'amount'],
      },
    },
  },
  'order.cancelled': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id', 'id'],
      },
    },
  },
  'order.delivered': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id', 'id'],
      },
    },
  },
  'payment.authorized': {
    1: {
      required: ['paymentId', 'orderId', 'amount'],
      aliases: {
        paymentId: ['payment_id', 'id'],
        orderId: ['order_id'],
      },
    },
  },
  'payment.captured': {
    1: {
      required: ['paymentId', 'orderId', 'amount'],
      aliases: {
        paymentId: ['payment_id', 'id'],
        orderId: ['order_id'],
      },
    },
  },
  'payment.failed': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'payment.refunded': {
    1: {
      required: ['paymentId', 'orderId', 'amount'],
      aliases: {
        paymentId: ['payment_id', 'id'],
        orderId: ['order_id'],
      },
    },
  },
  'inventory.reserved': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'inventory.committed': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'inventory.released': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'shipment.created': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'shipment.shipped': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'shipment.delivered': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'return.pickedUp': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'return.received': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'return.completed': {
    1: {
      required: ['orderId'],
      aliases: {
        orderId: ['order_id'],
      },
    },
  },
  'review.created': {
    1: {
      required: ['productId', 'rating'],
      aliases: {
        productId: ['product_id'],
      },
    },
  },
  'review.updated': {
    1: {
      required: ['productId', 'rating'],
      aliases: {
        productId: ['product_id'],
      },
    },
  },
  'review.deleted': {
    1: {
      required: ['productId'],
      aliases: {
        productId: ['product_id'],
      },
    },
  },
});

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
    const resolvedAggregateId =
      aggregateId ||
      payload?.orderId ||
      payload?.order_id ||
      payload?.productId ||
      payload?.product_id ||
      payload?.paymentId ||
      payload?.payment_id ||
      payload?.id ||
      eventId;

    return {
      eventId,
      eventType,
      eventVersion,
      occurredAt,
      sourceService,
      aggregateType,
      aggregateId: String(resolvedAggregateId),
      correlationId,
      traceId,
      requestId,
      idempotencyKey,
      payload,
    };
  }

  /**
   * Validates if an object conforms to the strengthened KafkaEventEnvelope schema.
   * Required fields: eventId, eventType, occurredAt, eventVersion, sourceService, aggregateType, aggregateId, payload.
   */
  static validate(envelope) {
    if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
      return false;
    }

    // Required non-empty string fields
    const hasEventId = typeof envelope.eventId === 'string' && envelope.eventId.trim().length > 0;
    const hasEventType =
      typeof envelope.eventType === 'string' && envelope.eventType.trim().length > 0;
    const hasOccurredAt =
      typeof envelope.occurredAt === 'string' && envelope.occurredAt.trim().length > 0;
    const hasSourceService =
      typeof envelope.sourceService === 'string' && envelope.sourceService.trim().length > 0;
    const hasAggregateType =
      typeof envelope.aggregateType === 'string' && envelope.aggregateType.trim().length > 0;
    const hasAggregateId =
      envelope.aggregateId !== undefined &&
      envelope.aggregateId !== null &&
      String(envelope.aggregateId).trim().length > 0;

    // Required object payload (not null, not primitive)
    const hasPayload =
      envelope.payload !== undefined &&
      envelope.payload !== null &&
      typeof envelope.payload === 'object' &&
      !Array.isArray(envelope.payload);

    // eventVersion must be a positive integer
    const versionNum = Number(envelope.eventVersion);
    const hasValidVersion =
      envelope.eventVersion !== undefined &&
      envelope.eventVersion !== null &&
      !isNaN(versionNum) &&
      versionNum > 0 &&
      Number.isInteger(versionNum);

    return Boolean(
      hasEventId &&
      hasEventType &&
      hasOccurredAt &&
      hasSourceService &&
      hasAggregateType &&
      hasAggregateId &&
      hasPayload &&
      hasValidVersion,
    );
  }

  /**
   * Validates if the envelope's eventVersion is among supported versions
   */
  static validateVersion(envelope, supportedVersions = [1]) {
    if (
      !envelope ||
      typeof envelope !== 'object' ||
      envelope.eventVersion === undefined ||
      envelope.eventVersion === null
    ) {
      return false;
    }
    const versionNum = Number(envelope.eventVersion);
    return supportedVersions.some(
      (v) =>
        v === envelope.eventVersion ||
        Number(v) === versionNum ||
        String(v) === String(envelope.eventVersion),
    );
  }
}

/**
 * Asserts that an envelope conforms to the mandatory contract. Throws a descriptive Error if invalid.
 *
 * @param {object} envelope
 * @returns {boolean} true if valid
 * @throws {Error} if envelope is invalid or missing required metadata
 */
export function assertValidEnvelope(envelope) {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
    throw new Error('Invalid Kafka event envelope: Envelope must be a non-null object');
  }

  const errors = [];
  if (!envelope.eventId || typeof envelope.eventId !== 'string' || !envelope.eventId.trim()) {
    errors.push('missing or invalid eventId');
  }
  if (!envelope.eventType || typeof envelope.eventType !== 'string' || !envelope.eventType.trim()) {
    errors.push('missing or invalid eventType');
  }
  if (
    !envelope.occurredAt ||
    typeof envelope.occurredAt !== 'string' ||
    !envelope.occurredAt.trim()
  ) {
    errors.push('missing or invalid occurredAt');
  }
  const versionNum = Number(envelope.eventVersion);
  if (
    envelope.eventVersion === undefined ||
    envelope.eventVersion === null ||
    isNaN(versionNum) ||
    versionNum <= 0 ||
    !Number.isInteger(versionNum)
  ) {
    errors.push('missing or invalid eventVersion');
  }
  if (
    !envelope.sourceService ||
    typeof envelope.sourceService !== 'string' ||
    !envelope.sourceService.trim()
  ) {
    errors.push('missing or invalid sourceService');
  }
  if (
    !envelope.aggregateType ||
    typeof envelope.aggregateType !== 'string' ||
    !envelope.aggregateType.trim()
  ) {
    errors.push('missing or invalid aggregateType');
  }
  if (
    envelope.aggregateId === undefined ||
    envelope.aggregateId === null ||
    !String(envelope.aggregateId).trim()
  ) {
    errors.push('missing or invalid aggregateId');
  }
  if (
    !envelope.payload ||
    typeof envelope.payload !== 'object' ||
    Array.isArray(envelope.payload)
  ) {
    errors.push('missing or invalid payload');
  }

  if (errors.length > 0) {
    throw new Error(`KafkaEventEnvelope validation failed: ${errors.join(', ')}`);
  }
  return true;
}

/**
 * Validates event payload against lightweight in-code contract registry.
 * Tolerates additional unknown fields (Tolerant Reader pattern).
 *
 * @param {string} eventType
 * @param {object} payload
 * @param {number} [eventVersion=1]
 * @returns {{ valid: boolean, error?: string, missingFields?: string[], governed?: boolean }}
 */
export function validatePayloadContract(eventType, payload, eventVersion = 1) {
  if (!eventType || typeof eventType !== 'string') {
    return { valid: false, error: 'eventType must be a non-empty string' };
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, error: 'payload must be a non-null object' };
  }

  const contract = EVENT_PAYLOAD_CONTRACTS[eventType];
  if (!contract) {
    return { valid: true, governed: false };
  }

  const versionContract = contract[eventVersion];
  if (!versionContract) {
    return {
      valid: false,
      error: `Unsupported eventVersion ${eventVersion} for eventType '${eventType}'. Supported versions: ${Object.keys(contract).join(', ')}`,
      governed: true,
    };
  }

  const missingFields = [];
  for (const field of versionContract.required) {
    const aliases = versionContract.aliases?.[field] || [];
    const candidates = [field, ...aliases];
    const found = candidates.some(
      (key) => payload[key] !== undefined && payload[key] !== null && payload[key] !== '',
    );
    if (!found) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Payload missing required fields for '${eventType}' v${eventVersion}: ${missingFields.join(', ')}`,
      missingFields,
      governed: true,
    };
  }

  return { valid: true, governed: true };
}
