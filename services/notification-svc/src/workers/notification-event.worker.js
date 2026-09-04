import { ValidationError, EventTypes, logger } from '@ecommerce/shared';

import { NotificationService } from '../services/notification.service.js';
import { eventIdempotencyService as defaultIdempotencyService } from '../services/event-idempotency.service.js';

export class NotificationEventWorker {
  constructor({
    notificationService = new NotificationService(),
    idempotencyService = defaultIdempotencyService,
    consumerName = 'notification-event-worker',
  } = {}) {
    this.notificationService = notificationService;
    this.idempotencyService = idempotencyService;
    this.consumerName = consumerName;
  }

  /**
   * Processes a domain event and dispatches appropriate multi-channel notifications
   */
  async processEvent(event) {
    if (!event || typeof event !== 'object') {
      throw new ValidationError('Valid event object is required');
    }

    const { eventId, eventType, payload = {}, sourceService } = event;
    if (!eventId) {
      throw new ValidationError('Event ID is required in event envelope');
    }
    if (!eventType) {
      throw new ValidationError('Event Type is required in event envelope');
    }

    // 1. Consumer-side idempotency check
    const isAlreadyProcessed = await this.idempotencyService.isProcessed(
      eventId,
      this.consumerName,
    );
    if (isAlreadyProcessed) {
      logger.info(
        { eventId, eventType, consumer: this.consumerName },
        'Event already processed by notification consumer; skipping duplicate',
      );
      return { status: 'SKIPPED_DUPLICATE', eventId };
    }

    const userId = payload.userId || payload.user_id;
    if (!userId) {
      logger.warn(
        { eventId, eventType },
        'Event payload does not contain userId; skipping notification dispatch',
      );
      await this.idempotencyService.markProcessed(eventId, this.consumerName, {
        skipped: 'no_user_id',
      });
      return { status: 'SKIPPED_NO_USER', eventId };
    }

    // 2. Map event to notification parameters
    const notificationConfig = this._mapEventToNotification(eventType, payload);
    if (!notificationConfig) {
      logger.info({ eventId, eventType }, 'No notification mapping found for event type; skipping');
      await this.idempotencyService.markProcessed(eventId, this.consumerName, {
        skipped: 'unmapped_event',
      });
      return { status: 'UNMAPPED_EVENT', eventId };
    }

    // 3. Dispatch notification using existing Phase 3 notificationService
    const result = await this.notificationService.dispatchNotification({
      userId,
      templateCode: notificationConfig.templateCode,
      channels: notificationConfig.channels,
      category: notificationConfig.category,
      recipient: {
        email: payload.email || payload.customerEmail || `${userId}@example.com`,
        phone: payload.phone || payload.customerPhone || '+919999999999',
      },
      templateData: {
        ...payload,
        ...notificationConfig.templateData,
      },
      idempotencyKey: `notif_${eventId}`,
      eventId,
      sourceService: sourceService || 'event-bus',
    });

    // 4. Mark processed in idempotency store
    await this.idempotencyService.markProcessed(eventId, this.consumerName, {
      dispatches: result.dispatches?.length || 0,
    });

    return { status: 'PROCESSED', eventId, result };
  }

  /**
   * Internal mapper from domain event to notification template and channels
   */
  _mapEventToNotification(eventType, payload) {
    switch (eventType) {
      case EventTypes.ORDER_PLACED:
      case 'order.placed':
        return {
          templateCode: 'order.placed',
          channels: ['EMAIL', 'SMS', 'IN_APP'],
          category: 'ORDERS',
          templateData: {
            orderNumber: payload.orderNumber || payload.order_number,
            totalAmount: payload.totalAmount || payload.total_amount,
            itemCount: payload.items?.length || 1,
          },
        };

      case EventTypes.PAYMENT_CAPTURED:
      case 'payment.captured':
        return {
          templateCode: 'payment.success',
          channels: ['EMAIL', 'IN_APP'],
          category: 'PAYMENTS',
          templateData: {
            orderNumber: payload.orderNumber || payload.orderId,
            amount: payload.amount,
          },
        };

      case EventTypes.PAYMENT_FAILED:
      case 'payment.failed':
        return {
          templateCode: 'payment.failed',
          channels: ['EMAIL', 'SMS', 'IN_APP'],
          category: 'PAYMENTS',
          templateData: {
            orderNumber: payload.orderNumber || payload.orderId,
            failureReason: payload.failureReason || 'Payment authorization failed',
          },
        };

      case EventTypes.SHIPMENT_SHIPPED:
      case 'shipment.shipped':
        return {
          templateCode: 'order.shipped',
          channels: ['EMAIL', 'SMS', 'IN_APP'],
          category: 'ORDERS',
          templateData: {
            shipmentNumber: payload.shipmentNumber,
            trackingNumber: payload.trackingNumber,
            courierCode: payload.courierCode,
          },
        };

      case EventTypes.SHIPMENT_DELIVERED:
      case 'shipment.delivered':
        return {
          templateCode: 'order.delivered',
          channels: ['EMAIL', 'SMS', 'IN_APP'],
          category: 'ORDERS',
          templateData: {
            shipmentNumber: payload.shipmentNumber,
            podReceivedBy: payload.podReceivedBy || 'Recipient',
          },
        };

      case EventTypes.RETURN_REQUESTED:
      case 'return.requested':
        return {
          templateCode: 'return.requested',
          channels: ['EMAIL', 'IN_APP'],
          category: 'ORDERS',
          templateData: {
            returnNumber: payload.returnNumber,
          },
        };

      case EventTypes.RETURN_COMPLETED:
      case 'return.completed':
        return {
          templateCode: 'return.completed',
          channels: ['EMAIL', 'IN_APP'],
          category: 'ORDERS',
          templateData: {
            returnNumber: payload.returnNumber,
          },
        };

      case EventTypes.PAYMENT_REFUNDED:
      case 'payment.refunded':
        return {
          templateCode: 'payment.refunded',
          channels: ['EMAIL', 'IN_APP'],
          category: 'PAYMENTS',
          templateData: {
            orderId: payload.orderId,
            refundAmount: payload.amount,
          },
        };

      default:
        return null;
    }
  }
}

export const notificationEventWorker = new NotificationEventWorker();
