import { metricsRegistry } from '../utils/metrics.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { calculateRetryDelayWithJitter } from '../utils/concurrency.js';

import { kafkaClient as defaultClient } from './kafka-client.js';
import { KafkaEventEnvelope } from './kafka-event-envelope.js';
import { KafkaPublishError } from './kafka-errors.js';

export class KafkaProducer {
  constructor({
    client = defaultClient,
    serviceName = process.env.SERVICE_NAME || 'ecommerce-svc',
    logger = defaultLogger,
    maxRetries = parseInt(process.env.KAFKA_PRODUCER_MAX_RETRIES || '3', 10),
    baseRetryMs = parseInt(process.env.KAFKA_PRODUCER_RETRY_BASE_MS || '300', 10),
  } = {}) {
    this.client = client;
    this.kafka = client.getKafkaInstance();
    this.serviceName = serviceName;
    this.logger = logger;
    this.maxRetries = maxRetries;
    this.baseRetryMs = baseRetryMs;
    this.producer = null;
    this.isConnected = false;
  }

  /**
   * Connects producer to Kafka cluster with hardened idempotency and strict ordering
   */
  async connect() {
    if (this.isConnected && this.producer) {
      return;
    }
    try {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: false,
        idempotent: true,
        maxInFlightRequests: 1,
        transactionTimeout: 30000,
      });
      await this.producer.connect();
      this.isConnected = true;
      this.logger.info({ service: this.serviceName }, 'Kafka producer connected');
    } catch (err) {
      this.isConnected = false;
      this.logger.error(
        { err: err.message, service: this.serviceName },
        'Kafka producer connect failed',
      );
      throw new KafkaPublishError(`Producer failed to connect: ${err.message}`, { cause: err });
    }
  }

  /**
   * Disconnects producer gracefully
   */
  async disconnect() {
    if (!this.producer || !this.isConnected) {
      return;
    }
    try {
      await this.producer.disconnect();
      this.isConnected = false;
      this.logger.info({ service: this.serviceName }, 'Kafka producer disconnected cleanly');
    } catch (err) {
      this.logger.warn({ err: err.message }, 'Error disconnecting Kafka producer');
    }
  }

  /**
   * Publishes an event envelope to a specified Kafka topic with deterministic keying and bounded retry
   */
  async publish({ topic, key, eventEnvelope, headers = {} }) {
    if (!topic) {
      throw new KafkaPublishError('Target Kafka topic is required');
    }

    if (eventEnvelope) {
      eventEnvelope.eventVersion = eventEnvelope.eventVersion ?? 1;
      eventEnvelope.occurredAt = eventEnvelope.occurredAt || new Date().toISOString();
      if (eventEnvelope.aggregateId === undefined || eventEnvelope.aggregateId === null) {
        eventEnvelope.aggregateId =
          key !== undefined && key !== null ? String(key) : String(eventEnvelope.eventId || '');
      }
    }

    if (!KafkaEventEnvelope.validate(eventEnvelope)) {
      throw new KafkaPublishError(
        'Event envelope is missing required fields (eventId, eventType, payload, eventVersion, occurredAt)',
        { topic, eventId: eventEnvelope?.eventId },
      );
    }

    if (!this.isConnected || !this.producer) {
      await this.connect();
    }

    const partitionKey = String(
      key !== undefined && key !== null ? key : eventEnvelope.aggregateId || eventEnvelope.eventId,
    );

    const messageHeaders = {
      'x-trace-id': eventEnvelope.traceId || '',
      'x-request-id': eventEnvelope.requestId || '',
      'correlation-id': eventEnvelope.correlationId || '',
      'source-service': eventEnvelope.sourceService || this.serviceName,
      'event-type': eventEnvelope.eventType || '',
      'event-version': String(eventEnvelope.eventVersion || 1),
      ...headers,
    };

    let attempt = 0;
    let lastError = null;

    while (attempt <= this.maxRetries) {
      attempt++;
      try {
        const recordMetaData = await this.producer.send({
          topic,
          acks: -1,
          messages: [
            {
              key: partitionKey,
              value: JSON.stringify(eventEnvelope),
              headers: messageHeaders,
              timestamp: String(Date.now()),
            },
          ],
        });

        // Track metric
        const metric = metricsRegistry.getMetric('kafka_messages_produced_total');
        if (metric) {
          metric.inc({
            service: this.serviceName,
            topic,
            event_type: eventEnvelope.eventType,
          });
        }

        this.logger.info(
          {
            service: this.serviceName,
            topic,
            key: partitionKey,
            eventId: eventEnvelope.eventId,
            eventType: eventEnvelope.eventType,
            partition: recordMetaData[0]?.partition,
            offset: recordMetaData[0]?.baseOffset,
          },
          'Published event to Kafka topic',
        );

        return recordMetaData;
      } catch (err) {
        lastError = err;
        if (attempt <= this.maxRetries) {
          const delayMs = calculateRetryDelayWithJitter({
            attempt,
            baseDelayMs: this.baseRetryMs,
            maxDelayMs: 5000,
          });
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    this.logger.error(
      {
        err: lastError.message,
        service: this.serviceName,
        topic,
        eventId: eventEnvelope.eventId,
        attempts: attempt,
      },
      'Failed to publish event to Kafka topic after retries',
    );
    throw new KafkaPublishError(
      `Kafka produce failed for event ${eventEnvelope.eventId}: ${lastError.message}`,
      {
        cause: lastError,
        topic,
        eventId: eventEnvelope.eventId,
      },
    );
  }
}
