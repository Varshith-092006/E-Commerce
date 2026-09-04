import { ValidationError, EventTypes, createLogger } from '@ecommerce/shared';

import { orderSagaService as defaultOrderSagaService } from '../services/order-saga.service.js';
import { prisma as defaultPrisma } from '../lib/prisma.js';

const logger = createLogger({ service: 'order-svc:order-saga-worker' });

export class OrderSagaWorker {
  constructor({
    orderSagaService = defaultOrderSagaService,
    prismaClient = defaultPrisma,
    consumerName = 'order-saga-worker',
  } = {}) {
    this.orderSagaService = orderSagaService;
    this.prisma = prismaClient;
    this.consumerName = consumerName;
    this.processedEvents = new Set();
  }

  async isProcessed(eventId) {
    if (!eventId) {
      return false;
    }
    if (this.processedEvents.has(eventId)) {
      return true;
    }
    if (!this.prisma?.processedEvent) {
      return false;
    }
    try {
      const record = await this.prisma.processedEvent.findUnique({
        where: {
          consumer_group_event_id: {
            consumer_group: this.consumerName,
            event_id: eventId,
          },
        },
      });
      return Boolean(record);
    } catch {
      return false;
    }
  }

  async markProcessed(eventId, eventType) {
    if (!eventId) {
      return;
    }
    this.processedEvents.add(eventId);
    if (!this.prisma?.processedEvent) {
      return;
    }
    try {
      await this.prisma.processedEvent.create({
        data: {
          event_id: eventId,
          consumer_group: this.consumerName,
          event_type: eventType || 'unknown',
        },
      });
    } catch (err) {
      if (err.code !== 'P2002') {
        logger.warn({ err: err.message, eventId }, 'Error marking event as processed in DB');
      }
    }
  }

  /**
   * Consumes fulfillment, payment, and return events to synchronize order state
   */
  async processEvent(event) {
    if (!event || typeof event !== 'object') {
      throw new ValidationError('Valid event object is required');
    }

    const { eventId, eventType, payload = {} } = event;
    if (!eventId || !eventType) {
      throw new ValidationError('Event ID and Event Type are required');
    }

    const alreadyProcessed = await this.isProcessed(eventId);
    if (alreadyProcessed) {
      logger.info({ eventId, eventType }, 'Order saga event already processed; skipping duplicate');
      return { status: 'SKIPPED_DUPLICATE', eventId };
    }

    let result;

    switch (eventType) {
      case EventTypes.SHIPMENT_SHIPPED:
      case 'shipment.shipped': {
        result = await this.orderSagaService.handleShipmentShipped({
          orderId: payload.orderId || payload.order_id,
          shipmentNumber: payload.shipmentNumber,
          trackingNumber: payload.trackingNumber,
          courierCode: payload.courierCode,
          dispatchedAt: payload.dispatchedAt,
        });
        break;
      }

      case EventTypes.SHIPMENT_DELIVERED:
      case 'shipment.delivered': {
        result = await this.orderSagaService.handleShipmentDelivered({
          orderId: payload.orderId || payload.order_id,
          shipmentNumber: payload.shipmentNumber,
          trackingNumber: payload.trackingNumber,
          deliveredAt: payload.deliveredAt,
          podReceivedBy: payload.podReceivedBy,
          podSignature: payload.podSignature,
        });
        break;
      }

      case EventTypes.RETURN_COMPLETED:
      case 'return.completed': {
        result = await this.orderSagaService.handleReturnCompleted({
          orderId: payload.orderId || payload.order_id,
          returnId: payload.returnId || payload.return_id,
          returnNumber: payload.returnNumber || payload.return_number,
          completedAt: payload.completedAt,
        });
        break;
      }

      case EventTypes.INVENTORY_RELEASED:
      case 'inventory.released': {
        result = await this.orderSagaService.handleInventoryReleased({
          orderId: payload.orderId || payload.order_id,
          reason: payload.reason,
        });
        break;
      }

      default:
        return { status: 'UNMAPPED_EVENT', eventType };
    }

    await this.markProcessed(eventId, eventType);
    return { status: 'PROCESSED', eventId, result };
  }
}

export const orderSagaWorker = new OrderSagaWorker();
