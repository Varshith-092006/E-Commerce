import {
  OutboxProcessor,
  KafkaProducer,
  KafkaEventEnvelope,
  KafkaTopics,
  SecurityHeaders,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { FulfillmentOutboxRepository } from '../repositories/outbox.repository.js';

export class FulfillmentOutboxWorker {
  constructor({
    repository = new FulfillmentOutboxRepository(),
    kafkaProducer = null,
    notificationBaseUrl = process.env.NOTIFICATION_SVC_URL || 'http://localhost:4006',
    internalSecret = process.env.INTERNAL_GATEWAY_SECRET ||
      'ecommerce_dev_internal_secret_2026_super_secure_gateway_passcode',
    workerId = `fulfillment_worker_${process.pid}_${Math.random().toString(16).slice(2, 8)}`,
    batchSize = parseInt(process.env.OUTBOX_BATCH_SIZE || '10', 10),
    pollIntervalMs = parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || '1000', 10),
    lockTimeoutMs = parseInt(process.env.OUTBOX_LOCK_TIMEOUT_MS || '30000', 10),
    maxAttempts = parseInt(process.env.OUTBOX_MAX_ATTEMPTS || '5', 10),
    useKafka = process.env.USE_KAFKA !== 'false',
    logger = defaultLogger,
  } = {}) {
    this.repository = repository;
    this.kafkaProducer =
      kafkaProducer || new KafkaProducer({ serviceName: 'fulfillment-svc', logger });
    this.notificationBaseUrl = notificationBaseUrl.replace(/\/$/, '');
    this.internalSecret = internalSecret;
    this.useKafka = useKafka;
    this.logger = logger;

    this.processor = new OutboxProcessor({
      repository: this.repository,
      processEvent: this.processEvent.bind(this),
      workerId,
      batchSize,
      pollIntervalMs,
      lockTimeoutMs,
      maxAttempts,
      logger: this.logger,
    });
  }

  start() {
    this.processor.start();
  }

  async stop(timeoutMs = 10000) {
    await this.processor.stop(timeoutMs);
    if (this.useKafka && this.kafkaProducer) {
      await this.kafkaProducer.disconnect();
    }
  }

  /**
   * Processes an outbox event by publishing to Kafka topic ecommerce.fulfillment-events
   */
  async processEvent(event) {
    const rawPayload = event.payload || {};
    const payload = rawPayload.payload ? rawPayload.payload : rawPayload;
    const eventType = event.event_type;
    const eventId = rawPayload.eventId || event.id;
    const aggregateId =
      payload.orderId || payload.order_id || payload.shipmentId || event.aggregate_id;

    if (this.useKafka) {
      const envelope = KafkaEventEnvelope.create({
        eventId,
        eventType,
        eventVersion: 1,
        sourceService: 'fulfillment-svc',
        aggregateType: 'fulfillment',
        aggregateId: String(aggregateId || ''),
        traceId: rawPayload.traceId,
        requestId: rawPayload.requestId,
        correlationId: rawPayload.correlationId,
        payload,
      });

      await this.kafkaProducer.publish({
        topic: KafkaTopics.FULFILLMENT_EVENTS,
        key: String(aggregateId || eventId),
        eventEnvelope: envelope,
      });

      return { processed: true, eventId, eventType, transport: 'kafka' };
    }

    // Forward to notification-svc event ingestion (REST fallback)
    const eventEnvelope = {
      eventId,
      eventType,
      sourceService: 'fulfillment-svc',
      timestamp: new Date().toISOString(),
      payload,
    };

    const headers = {
      'Content-Type': 'application/json',
      [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
      'x-internal-gateway-secret': this.internalSecret,
    };

    try {
      await fetch(`${this.notificationBaseUrl}/api/v1/notifications/events/ingest`, {
        method: 'POST',
        headers,
        body: JSON.stringify(eventEnvelope),
        signal: AbortSignal.timeout(4000),
      });
    } catch (err) {
      this.logger.warn(
        { err: err.message, eventId },
        'Fulfillment outbox notification forward warning',
      );
    }

    return { processed: true, eventId, eventType, transport: 'http_fallback' };
  }
}

export const fulfillmentOutboxWorker = new FulfillmentOutboxWorker();
