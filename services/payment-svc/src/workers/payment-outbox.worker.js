import {
  OutboxProcessor,
  KafkaProducer,
  KafkaEventEnvelope,
  KafkaTopics,
  SecurityHeaders,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { PaymentOutboxRepository } from '../repositories/outbox.repository.js';

export class PaymentOutboxWorker {
  constructor({
    repository = new PaymentOutboxRepository(),
    kafkaProducer = null,
    notificationBaseUrl = process.env.NOTIFICATION_SVC_URL || 'http://localhost:4006',
    internalSecret = process.env.INTERNAL_GATEWAY_SECRET ||
      'ecommerce_dev_internal_secret_2026_super_secure_gateway_passcode',
    workerId = `payment_worker_${process.pid}_${Math.random().toString(16).slice(2, 8)}`,
    batchSize = parseInt(process.env.OUTBOX_BATCH_SIZE || '10', 10),
    pollIntervalMs = parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || '1000', 10),
    lockTimeoutMs = parseInt(process.env.OUTBOX_LOCK_TIMEOUT_MS || '30000', 10),
    maxAttempts = parseInt(process.env.OUTBOX_MAX_ATTEMPTS || '5', 10),
    useKafka = process.env.USE_KAFKA !== 'false',
    logger = defaultLogger,
  } = {}) {
    this.repository = repository;
    this.kafkaProducer = kafkaProducer || new KafkaProducer({ serviceName: 'payment-svc', logger });
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

  /**
   * Starts the worker polling loop
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
   * Transforms a payment outbox event into a notification dispatch request (used for REST fallback)
   */
  transformEventToNotification(event) {
    const rawPayload = event.payload || {};
    const data = rawPayload.payload ? rawPayload.payload : rawPayload;

    const eventType = event.event_type;
    const eventId = rawPayload.eventId || event.id;
    const userId = data.userId || rawPayload.userId || data.user_id;

    if (!userId) {
      throw new Error(`Event "${eventId}" (${eventType}) is missing required userId`);
    }

    const recipient = {
      email: data.userEmail || null,
      phone: data.userPhone || null,
    };

    let templateCode;
    let channels = ['EMAIL', 'SMS', 'IN_APP'];
    let templateData = {};

    switch (eventType) {
      case 'payment.captured': {
        templateCode = 'payment.captured';
        templateData = {
          payment: {
            orderNumber: data.orderNumber || data.orderId || 'N/A',
            amount: data.amount ? String(data.amount) : '0.00',
            paymentMethod: data.paymentMethod || 'PREPAID',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      case 'payment.refunded':
      case 'payment.refund.processed': {
        templateCode = 'order.cancelled';
        channels = ['EMAIL', 'IN_APP'];
        templateData = {
          order: {
            orderNumber: data.orderNumber || data.orderId || 'N/A',
            cancellationReason: 'Refund processed to source account',
            refundStatus: 'PROCESSED',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      case 'payment.failed': {
        templateCode = 'payment.captured';
        channels = ['IN_APP'];
        templateData = {
          payment: {
            orderNumber: data.orderNumber || data.orderId || 'N/A',
            amount: data.amount ? String(data.amount) : '0.00',
            paymentMethod: data.paymentMethod || 'PREPAID',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      default: {
        throw new Error(`Unsupported payment event type: "${eventType}"`);
      }
    }

    return {
      userId,
      templateCode,
      channels,
      category: 'PAYMENTS',
      recipient,
      templateData,
      idempotencyKey: `evt_${eventId}`,
      eventId,
      sourceService: 'payment-svc',
    };
  }

  /**
   * Processes a single payment outbox event by publishing to Kafka topic ecommerce.payment-events
   */
  async processEvent(event) {
    const rawPayload = event.payload || {};
    const data = rawPayload.payload ? rawPayload.payload : rawPayload;
    const eventType = event.event_type;
    const eventId = rawPayload.eventId || event.id;
    const orderId = data.orderId || data.order_id || event.aggregate_id;

    if (this.useKafka) {
      const envelope = KafkaEventEnvelope.create({
        eventId,
        eventType,
        eventVersion: 1,
        sourceService: 'payment-svc',
        aggregateType: 'payment',
        aggregateId: String(orderId || ''),
        traceId: rawPayload.traceId,
        requestId: rawPayload.requestId,
        correlationId: rawPayload.correlationId,
        payload: data,
      });

      await this.kafkaProducer.publish({
        topic: KafkaTopics.PAYMENT_EVENTS,
        key: String(orderId || eventId),
        eventEnvelope: envelope,
      });

      return { processed: true, eventId, eventType, transport: 'kafka' };
    }

    // REST HTTP fallback for environments without Kafka broker running
    const notificationPayload = this.transformEventToNotification(event);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(`${this.notificationBaseUrl}/api/v1/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: this.internalSecret,
          'x-internal-gateway-secret': this.internalSecret,
        },
        body: JSON.stringify(notificationPayload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        const err = new Error(
          `notification-svc returned HTTP ${response.status}: ${errorBody.slice(0, 200)}`,
        );
        err.statusCode = response.status;
        err.status = response.status;
        throw err;
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('Timeout contacting notification-svc');
        timeoutErr.statusCode = 408;
        timeoutErr.retryable = true;
        throw timeoutErr;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
