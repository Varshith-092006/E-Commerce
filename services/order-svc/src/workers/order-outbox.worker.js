import {
  OutboxProcessor,
  KafkaProducer,
  KafkaEventEnvelope,
  KafkaTopics,
  SecurityHeaders,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { OrderOutboxRepository } from '../repositories/outbox.repository.js';

export class OrderOutboxWorker {
  constructor({
    repository = new OrderOutboxRepository(),
    kafkaProducer = null,
    notificationBaseUrl = process.env.NOTIFICATION_SVC_URL || 'http://localhost:4006',
    internalSecret = process.env.INTERNAL_GATEWAY_SECRET ||
      'ecommerce_dev_internal_secret_2026_super_secure_gateway_passcode',
    workerId = `order_worker_${process.pid}_${Math.random().toString(16).slice(2, 8)}`,
    batchSize = parseInt(process.env.OUTBOX_BATCH_SIZE || '10', 10),
    pollIntervalMs = parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || '1000', 10),
    lockTimeoutMs = parseInt(process.env.OUTBOX_LOCK_TIMEOUT_MS || '30000', 10),
    maxAttempts = parseInt(process.env.OUTBOX_MAX_ATTEMPTS || '5', 10),
    useKafka = process.env.USE_KAFKA !== 'false',
    logger = defaultLogger,
  } = {}) {
    this.repository = repository;
    this.kafkaProducer = kafkaProducer || new KafkaProducer({ serviceName: 'order-svc', logger });
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
   * Transforms an order outbox event into a notification dispatch request (used for REST fallback)
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
      email: data.shippingAddress?.email || data.userEmail || null,
      phone: data.shippingAddress?.phone || data.userPhone || null,
    };

    let templateCode;
    let channels = ['EMAIL', 'SMS', 'IN_APP'];
    let templateData = {};

    switch (eventType) {
      case 'order.placed': {
        templateCode = 'order.placed';
        templateData = {
          order: {
            orderNumber: data.orderNumber || data.order_number || 'N/A',
            totalAmount: data.totalAmount || data.total_amount || '0.00',
          },
          user: {
            name: data.shippingAddress?.fullName || data.shippingAddress?.full_name || 'Customer',
          },
        };
        break;
      }
      case 'order.confirmed': {
        templateCode = 'order.placed';
        channels = ['IN_APP'];
        templateData = {
          order: {
            orderNumber: data.orderNumber || data.order_number || 'N/A',
            totalAmount: data.totalAmount || data.total_amount || '0.00',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      case 'order.shipped': {
        templateCode = 'order.shipped';
        templateData = {
          order: {
            orderNumber: data.orderNumber || data.order_number || 'N/A',
            courierName: data.courierName || data.courier_name || 'Courier',
            trackingNumber: data.trackingNumber || data.tracking_number || 'N/A',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      case 'order.out_for_delivery': {
        templateCode = 'order.out_for_delivery';
        templateData = {
          order: {
            orderNumber: data.orderNumber || data.order_number || 'N/A',
            deliveryAgentName:
              data.deliveryAgentName || data.delivery_agent_name || 'Delivery Agent',
            deliveryAgentPhone: data.deliveryAgentPhone || data.delivery_agent_phone || '',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      case 'order.delivered': {
        templateCode = 'order.delivered';
        templateData = {
          order: {
            orderNumber: data.orderNumber || data.order_number || 'N/A',
            recipientName:
              data.podMetadata?.recipientName || data.pod_metadata?.recipientName || 'Customer',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      case 'order.cancelled': {
        templateCode = 'order.cancelled';
        templateData = {
          order: {
            orderNumber: data.orderNumber || data.order_number || 'N/A',
            cancellationReason: data.reason || 'Cancelled by request',
            refundStatus: data.refundStatus || 'PROCESSING',
          },
          user: {
            name: 'Customer',
          },
        };
        break;
      }
      default: {
        throw new Error(`Unsupported order event type: "${eventType}"`);
      }
    }

    return {
      userId,
      templateCode,
      channels,
      category: 'ORDERS',
      recipient,
      templateData,
      idempotencyKey: `evt_${eventId}`,
      eventId,
      sourceService: 'order-svc',
    };
  }

  /**
   * Processes an outbox event by publishing to Kafka topic ecommerce.order-events
   */
  async processEvent(event) {
    const rawPayload = event.payload || {};
    const data = rawPayload.payload ? rawPayload.payload : rawPayload;
    const eventType = event.event_type;
    const eventId = rawPayload.eventId || event.id;
    const orderId = data.orderId || data.order_id || data.id || event.aggregate_id;

    if (this.useKafka) {
      try {
        const envelope = KafkaEventEnvelope.create({
          eventId,
          eventType,
          sourceService: 'order-svc',
          aggregateType: 'order',
          aggregateId: String(orderId || ''),
          traceId: rawPayload.traceId,
          requestId: rawPayload.requestId,
          correlationId: rawPayload.correlationId,
          payload: data,
        });

        await this.kafkaProducer.publish({
          topic: KafkaTopics.ORDER_EVENTS,
          key: String(orderId || eventId),
          eventEnvelope: envelope,
        });

        return { processed: true, eventId, eventType, transport: 'kafka' };
      } catch (kafkaErr) {
        this.logger.warn(
          { err: kafkaErr.message, eventId, eventType },
          'Kafka publish failed in OrderOutboxWorker; attempting REST fallback',
        );
      }
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
