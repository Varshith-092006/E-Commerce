import {
  OutboxProcessor,
  KafkaProducer,
  KafkaEventEnvelope,
  KafkaTopics,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { CatalogOutboxRepository } from '../repositories/catalog-outbox.repository.js';
import { ReviewService } from '../services/review-service.js';

export class CatalogOutboxWorker {
  constructor({
    repository = new CatalogOutboxRepository(),
    reviewService = new ReviewService(),
    kafkaProducer = null,
    workerId = `catalog_worker_${process.pid}_${Math.random().toString(16).slice(2, 8)}`,
    batchSize = parseInt(process.env.OUTBOX_BATCH_SIZE || '10', 10),
    pollIntervalMs = parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || '1000', 10),
    lockTimeoutMs = parseInt(process.env.OUTBOX_LOCK_TIMEOUT_MS || '30000', 10),
    maxAttempts = parseInt(process.env.OUTBOX_MAX_ATTEMPTS || '5', 10),
    useKafka = process.env.USE_KAFKA !== 'false',
    logger = defaultLogger,
  } = {}) {
    this.repository = repository;
    this.reviewService = reviewService;
    this.kafkaProducer = kafkaProducer || new KafkaProducer({ serviceName: 'catalog-svc', logger });
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

  /**
   * Starts the outbox processor loop
   */
  start() {
    this.processor.start();
  }

  /**
   * Stops the worker and drains in-flight events
   */
  async stop(timeoutMs = 10000) {
    await this.processor.stop(timeoutMs);
    if (this.useKafka && this.kafkaProducer) {
      await this.kafkaProducer.disconnect();
    }
  }

  /**
   * Processes a single catalog outbox event
   */
  async processEvent(event) {
    const rawPayload = event.payload || {};
    const data = rawPayload.payload ? rawPayload.payload : rawPayload;
    const eventType = event.event_type;
    const eventId = rawPayload.eventId || event.id;
    const productId = data.productId || event.aggregate_id;

    if (this.useKafka) {
      const envelope = KafkaEventEnvelope.create({
        eventId,
        eventType,
        eventVersion: 1,
        sourceService: 'catalog-svc',
        aggregateType: 'ProductReview',
        aggregateId: String(productId || ''),
        payload: data,
      });

      await this.kafkaProducer.publish({
        topic: KafkaTopics.REVIEW_EVENTS,
        key: String(productId || eventId),
        eventEnvelope: envelope,
      });

      return { processed: true, eventId, eventType, transport: 'kafka' };
    }

    // Direct in-process fallback when Kafka is not running
    if (productId && (eventType === 'review.created' || eventType === 'review.updated')) {
      await this.reviewService.handleReviewEvent({
        eventId,
        eventType,
        productId,
        consumerGroup: 'catalog-outbox-direct',
      });
    }

    return { processed: true, eventId, eventType, transport: 'direct' };
  }
}
