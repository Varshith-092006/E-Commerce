import { metricsRegistry } from '../utils/metrics.js';
import { logger as defaultLogger } from '../utils/logger.js';

import { kafkaClient as defaultClient } from './kafka-client.js';
import { KafkaEventEnvelope } from './kafka-event-envelope.js';
import { KafkaPublishError } from './kafka-errors.js';

export class KafkaProducer {
  constructor({
    client = defaultClient,
    serviceName = process.env.SERVICE_NAME || 'ecommerce-svc',
    logger = defaultLogger,
  } = {}) {
    this.client = client;
    this.kafka = client.getKafkaInstance();
    this.serviceName = serviceName;
    this.logger = logger;
    this.producer = null;
    this.isConnected = false;
  }

  /**
   * Connects producer to Kafka cluster
   */
  async connect() {
    if (this.isConnected && this.producer) {
      return;
    }
    try {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: true,
        idempotent: true,
        maxInFlightRequests: 1,
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
   * Publishes an event envelope to a specified Kafka topic
   */
  async publish({ topic, key, eventEnvelope, headers = {} }) {
    if (!topic) {
      throw new KafkaPublishError('Target Kafka topic is required');
    }

    if (!KafkaEventEnvelope.validate(eventEnvelope)) {
      throw new KafkaPublishError(
        'Event envelope is missing required fields (eventId, eventType, payload)',
      );
    }

    if (!this.isConnected || !this.producer) {
      await this.connect();
    }

    const partitionKey = String(key || eventEnvelope.aggregateId || eventEnvelope.eventId);

    const messageHeaders = {
      'x-trace-id': eventEnvelope.traceId || '',
      'x-request-id': eventEnvelope.requestId || '',
      'correlation-id': eventEnvelope.correlationId || '',
      'source-service': eventEnvelope.sourceService || this.serviceName,
      'event-type': eventEnvelope.eventType || '',
      ...headers,
    };

    try {
      const recordMetaData = await this.producer.send({
        topic,
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
      this.logger.error(
        {
          err: err.message,
          service: this.serviceName,
          topic,
          eventId: eventEnvelope.eventId,
        },
        'Failed to publish event to Kafka topic',
      );
      throw new KafkaPublishError(
        `Kafka produce failed for event ${eventEnvelope.eventId}: ${err.message}`,
        {
          cause: err,
          topic,
          eventId: eventEnvelope.eventId,
        },
      );
    }
  }
}
