import { metricsRegistry } from '../utils/metrics.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { calculateRetryDelayWithJitter } from '../utils/concurrency.js';

import { kafkaClient as defaultClient } from './kafka-client.js';
import { KafkaProducer } from './kafka-producer.js';
import { KafkaTopics } from './kafka-topics.js';
import { KafkaEventEnvelope } from './kafka-event-envelope.js';
import { KafkaConsumerError } from './kafka-errors.js';

export class KafkaConsumerGroup {
  constructor({
    groupId,
    topics = [],
    handler,
    client = defaultClient,
    dlqProducer = null,
    serviceName = process.env.SERVICE_NAME || 'ecommerce-svc',
    maxRetries = parseInt(process.env.KAFKA_MAX_RETRIES || '5', 10),
    baseBackoffMs = parseInt(process.env.KAFKA_RETRY_BASE_DELAY_MS || '1000', 10),
    maxBackoffMs = parseInt(process.env.KAFKA_RETRY_MAX_DELAY_MS || '30000', 10),
    retryJitterPercent = parseInt(process.env.KAFKA_RETRY_JITTER_PERCENT || '20', 10),
    maxConcurrency = parseInt(process.env.MAX_KAFKA_CONCURRENCY || '5', 10),
    sessionTimeout = parseInt(process.env.KAFKA_SESSION_TIMEOUT_MS || '30000', 10),
    heartbeatInterval = parseInt(process.env.KAFKA_HEARTBEAT_INTERVAL_MS || '3000', 10),
    maxWaitTimeInMs = parseInt(process.env.KAFKA_MAX_WAIT_TIME_MS || '500', 10),
    supportedVersions = [1],
    logger = defaultLogger,
  } = {}) {
    if (!groupId) {
      throw new Error('KafkaConsumerGroup requires a groupId');
    }
    if (typeof handler !== 'function') {
      throw new Error('KafkaConsumerGroup requires an async handler function');
    }

    this.groupId = groupId;
    this.topics = Array.isArray(topics) ? topics : [topics];
    this.handler = handler;
    this.client = client;
    this.kafka = client.getKafkaInstance();
    this.dlqProducer =
      dlqProducer || new KafkaProducer({ client: this.client, serviceName, logger });
    this.serviceName = serviceName;
    this.maxRetries = maxRetries;
    this.baseBackoffMs = baseBackoffMs;
    this.maxBackoffMs = maxBackoffMs;
    this.retryJitterPercent = retryJitterPercent;
    this.maxConcurrency = maxConcurrency;
    this.sessionTimeout = sessionTimeout;
    this.heartbeatInterval = heartbeatInterval;
    this.maxWaitTimeInMs = maxWaitTimeInMs;
    this.supportedVersions = supportedVersions;
    this.logger = logger;
    this.consumer = null;
    this.isRunning = false;
  }

  /**
   * Connects consumer group, subscribes to topics, and begins run loop with bounded partition concurrency
   */
  async start() {
    if (this.isRunning) {
      return;
    }

    try {
      this.consumer = this.kafka.consumer({
        groupId: this.groupId,
        autoCommit: false,
        sessionTimeout: this.sessionTimeout,
        heartbeatInterval: this.heartbeatInterval,
        maxWaitTimeInMs: this.maxWaitTimeInMs,
      });

      await this.consumer.connect();

      for (const topic of this.topics) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
      }

      this.isRunning = true;
      this.logger.info(
        {
          service: this.serviceName,
          groupId: this.groupId,
          topics: this.topics,
          maxConcurrency: this.maxConcurrency,
        },
        'Kafka consumer group started',
      );

      await this.consumer.run({
        autoCommit: false,
        partitionsConsumedConcurrently: Math.min(3, this.maxConcurrency),
        eachMessage: async ({ topic, partition, message, heartbeat }) => {
          await this.processSingleMessage({ topic, partition, message, heartbeat });
        },
      });
    } catch (err) {
      this.isRunning = false;
      this.logger.error(
        { err: err.message, service: this.serviceName, groupId: this.groupId },
        'Error starting Kafka consumer group',
      );
      throw new KafkaConsumerError(
        `Failed to start consumer group ${this.groupId}: ${err.message}`,
        { cause: err },
      );
    }
  }

  /**
   * Stops consumer group cleanly
   */
  async stop() {
    if (!this.consumer || !this.isRunning) {
      return;
    }
    try {
      this.isRunning = false;
      await this.consumer.disconnect();
      this.logger.info(
        { service: this.serviceName, groupId: this.groupId },
        'Kafka consumer group stopped cleanly',
      );
    } catch (err) {
      this.logger.warn({ err: err.message }, 'Error stopping Kafka consumer group');
    }
  }

  /**
   * Updates consumer lag metrics in Prometheus
   */
  updateLagMetrics(topic, partition, lag) {
    const partitionGauge = metricsRegistry.getMetric('kafka_consumer_partition_lag');
    if (partitionGauge) {
      partitionGauge.set(
        {
          service: this.serviceName,
          topic,
          partition: String(partition),
          consumer_group: this.groupId,
        },
        lag,
      );
    }
    const groupGauge = metricsRegistry.getMetric('kafka_consumer_lag');
    if (groupGauge) {
      groupGauge.set(
        {
          service: this.serviceName,
          topic,
          consumer_group: this.groupId,
        },
        lag,
      );
    }
  }

  /**
   * Processes a single message with exponential backoff retries, trace propagation, metrics, schema/version checks, and DLQ fallback
   */
  async processSingleMessage({ topic, partition, message, heartbeat }) {
    const startTime = Date.now();
    let envelope = null;
    let rawString = '';

    // 1. Parse JSON
    try {
      rawString = message.value ? message.value.toString('utf-8') : '{}';
      envelope = JSON.parse(rawString);
    } catch (parseErr) {
      this.logger.error(
        { err: parseErr.message, topic, partition, offset: message.offset },
        'Malformed JSON in Kafka message; sending to DLQ',
      );
      await this.sendToDLQ({
        topic,
        partition,
        offset: message.offset,
        rawPayload: rawString,
        error: parseErr,
        reason: 'MALFORMED_JSON',
      });
      await this.commitOffset(topic, partition, message.offset);
      return;
    }

    // 2. Validate envelope schema
    if (!KafkaEventEnvelope.validate(envelope)) {
      this.logger.error(
        { topic, partition, offset: message.offset },
        'Event envelope missing required fields; routing to DLQ',
      );
      await this.sendToDLQ({
        topic,
        partition,
        offset: message.offset,
        envelope,
        rawPayload: rawString,
        error: new Error(
          'Event envelope missing required schema fields (eventId, eventType, payload, occurredAt, eventVersion)',
        ),
        reason: 'SCHEMA_VALIDATION_FAILED',
      });
      await this.commitOffset(topic, partition, message.offset);
      return;
    }

    // 3. Validate supported event version
    if (!KafkaEventEnvelope.validateVersion(envelope, this.supportedVersions)) {
      this.logger.error(
        { topic, partition, offset: message.offset, eventVersion: envelope.eventVersion },
        'Unsupported event version; routing to DLQ',
      );
      await this.sendToDLQ({
        topic,
        partition,
        offset: message.offset,
        envelope,
        rawPayload: rawString,
        error: new Error(`Unsupported event version: ${envelope.eventVersion}`),
        reason: 'UNSUPPORTED_EVENT_VERSION',
      });
      await this.commitOffset(topic, partition, message.offset);
      return;
    }

    const eventType = envelope.eventType || 'unknown';
    const eventId = envelope.eventId || `offset_${message.offset}`;

    // Extract headers for log & trace correlation
    const traceId = envelope.traceId || message.headers?.['x-trace-id']?.toString() || '';
    const requestId = envelope.requestId || message.headers?.['x-request-id']?.toString() || '';
    const correlationId =
      envelope.correlationId || message.headers?.['correlation-id']?.toString() || '';

    let attempt = 0;
    let success = false;
    let lastError = null;

    while (attempt < this.maxRetries && !success) {
      attempt += 1;
      try {
        await this.handler({
          event: envelope,
          topic,
          partition,
          offset: message.offset,
          consumerGroup: this.groupId,
          headers: message.headers || {},
          traceId,
          requestId,
          correlationId,
          heartbeat: typeof heartbeat === 'function' ? heartbeat : async () => {},
        });

        success = true;
      } catch (err) {
        lastError = err;
        const isRetryable = err.retryable !== false && !err.isPermanent;

        this.logger.warn(
          {
            service: this.serviceName,
            groupId: this.groupId,
            topic,
            partition,
            offset: message.offset,
            eventId,
            eventType,
            attempt,
            maxRetries: this.maxRetries,
            isRetryable,
            err: err.message,
          },
          `Kafka event processing attempt ${attempt} failed`,
        );

        if (!isRetryable) {
          this.logger.error(
            { eventId, eventType, err: err.message },
            'Non-retryable error encountered; stopping retry loop',
          );
          break;
        }

        if (attempt < this.maxRetries) {
          // Increment retries counter
          const retriesMetric = metricsRegistry.getMetric('kafka_consumer_retries_total');
          if (retriesMetric) {
            retriesMetric.inc({
              service: this.serviceName,
              topic,
              consumer_group: this.groupId,
            });
          }

          const delayMs = calculateRetryDelayWithJitter({
            attempt,
            baseDelayMs: this.baseBackoffMs,
            maxDelayMs: this.maxBackoffMs,
            jitterPercent: this.retryJitterPercent,
          });
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    const durationSeconds = (Date.now() - startTime) / 1000;

    // Report metric for duration
    const durationMetric = metricsRegistry.getMetric('kafka_processing_duration_seconds');
    if (durationMetric) {
      durationMetric.observe(
        {
          service: this.serviceName,
          topic,
          consumer_group: this.groupId,
        },
        durationSeconds,
      );
    }

    if (success) {
      // Increment consumed and processed records counters
      const consumedMetric = metricsRegistry.getMetric('kafka_messages_consumed_total');
      if (consumedMetric) {
        consumedMetric.inc({
          service: this.serviceName,
          topic,
          event_type: eventType,
          consumer_group: this.groupId,
        });
      }

      const processedMetric = metricsRegistry.getMetric('kafka_consumer_records_processed_total');
      if (processedMetric) {
        processedMetric.inc({
          service: this.serviceName,
          topic,
          consumer_group: this.groupId,
        });
      }

      await this.commitOffset(topic, partition, message.offset);
    } else {
      // Increment errors counter
      const errorMetric = metricsRegistry.getMetric('kafka_consumer_errors_total');
      if (errorMetric) {
        errorMetric.inc({
          service: this.serviceName,
          topic,
          consumer_group: this.groupId,
          error_type: lastError?.code || 'PROCESSING_FAILURE',
        });
      }

      // Send to DLQ
      await this.sendToDLQ({
        topic,
        partition,
        offset: message.offset,
        envelope,
        error: lastError,
        attempts: attempt,
        reason: 'RETRY_EXHAUSTED',
      });

      // Commit offset after DLQ routing to prevent infinite lock
      await this.commitOffset(topic, partition, message.offset);
    }
  }

  /**
   * Commits offset for processed message
   */
  async commitOffset(topic, partition, offset) {
    try {
      await this.consumer.commitOffsets([
        {
          topic,
          partition,
          offset: String(BigInt(offset) + 1n),
        },
      ]);
    } catch (err) {
      this.logger.error(
        { err: err.message, topic, partition, offset },
        'Failed to commit Kafka offset',
      );
    }
  }

  /**
   * Routes unprocessable or failed event to DLQ topic
   */
  async sendToDLQ({
    topic,
    partition,
    offset,
    envelope,
    rawPayload,
    error,
    attempts = 1,
    reason = 'FAILED',
  }) {
    const dlqTopic = KafkaTopics.DEAD_LETTER_EVENTS;
    const dlqEnvelope = KafkaEventEnvelope.create({
      eventType: 'event.failed_max_retries',
      eventVersion: 1,
      sourceService: this.serviceName,
      aggregateType: 'dead-letter',
      aggregateId: String(envelope?.aggregateId || envelope?.eventId || `offset_${offset}`),
      correlationId: envelope?.correlationId,
      traceId: envelope?.traceId,
      requestId: envelope?.requestId,
      payload: {
        originalTopic: topic,
        originalPartition: partition,
        originalOffset: offset,
        consumerGroup: this.groupId,
        attempts,
        failureReason: reason,
        errorMessage: error?.message || 'Unknown processing failure',
        stackTrace: error?.stack || null,
        failedAt: new Date().toISOString(),
        originalEnvelope: envelope || null,
        rawPayload: rawPayload || null,
      },
    });

    try {
      await this.dlqProducer.publish({
        topic: dlqTopic,
        key: String(topic),
        eventEnvelope: dlqEnvelope,
      });

      const dlqMetric = metricsRegistry.getMetric('kafka_dlq_messages_total');
      if (dlqMetric) {
        dlqMetric.inc({
          service: this.serviceName,
          topic,
          consumer_group: this.groupId,
        });
      }

      const dlqMetricStd = metricsRegistry.getMetric('kafka_consumer_dlq_total');
      if (dlqMetricStd) {
        dlqMetricStd.inc({
          service: this.serviceName,
          topic,
          consumer_group: this.groupId,
        });
      }

      this.logger.error(
        {
          service: this.serviceName,
          groupId: this.groupId,
          originalTopic: topic,
          originalOffset: offset,
          dlqTopic,
          err: error?.message,
        },
        'Routed message to Dead Letter Queue (DLQ)',
      );
    } catch (dlqErr) {
      this.logger.error(
        { err: dlqErr.message, originalTopic: topic, offset },
        'CRITICAL: Failed to publish message to Dead Letter Queue (DLQ)',
      );
    }
  }
}
