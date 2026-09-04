import { ValidationError, EventTypes, logger } from '@ecommerce/shared';

import { inventoryReservationService as defaultReservationService } from '../services/inventory-reservation.service.js';
import { reservationRepository as defaultReservationRepo } from '../repositories/reservation.repository.js';
import { prisma as defaultPrisma } from '../lib/prisma.js';

export class OrderEventWorker {
  constructor({
    reservationService = defaultReservationService,
    reservationRepo = defaultReservationRepo,
    prismaClient = defaultPrisma,
    consumerName = 'fulfillment-order-event-worker',
  } = {}) {
    this.reservationService = reservationService;
    this.reservationRepo = reservationRepo;
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
   * Processes order lifecycle events to manage atomic inventory reservations
   */
  async processEvent(event) {
    if (!event || typeof event !== 'object') {
      throw new ValidationError('Valid event object is required');
    }

    const { eventId, eventType, payload = {} } = event;
    if (!eventId || !eventType) {
      throw new ValidationError('Event ID and Event Type are required');
    }

    // Idempotency check
    const alreadyProcessed = await this.isProcessed(eventId);
    if (alreadyProcessed) {
      logger.info({ eventId, eventType }, 'Order event already processed; skipping duplicate');
      return { status: 'SKIPPED_DUPLICATE', eventId };
    }

    let result;

    switch (eventType) {
      case EventTypes.ORDER_PLACED:
      case 'order.placed': {
        const orderId = payload.orderId || payload.order_id || payload.id;
        const userId = payload.userId || payload.user_id;
        const items = payload.items || [];

        if (!orderId || !userId) {
          throw new ValidationError('orderId and userId required for order.placed processing');
        }

        const reservationKey = `res_ord_${orderId}`;

        result = await this.reservationService.createReservation({
          userId,
          orderId,
          reservationKey,
          items: items.map((item) => ({
            productId: item.productId || item.product_id,
            sku: item.sku,
            sellerId: item.sellerId || item.seller_id,
            quantity: item.quantity,
            warehouseId: item.warehouseId || item.warehouse_id,
          })),
        });
        break;
      }

      case EventTypes.ORDER_CANCELLED:
      case 'order.cancelled': {
        const orderId = payload.orderId || payload.order_id || payload.id;
        if (!orderId) {
          throw new ValidationError('orderId required for order.cancelled processing');
        }

        const reservation = await this.reservationRepo.findByReservationKey(`res_ord_${orderId}`);
        if (reservation && reservation.status === 'HELD') {
          result = await this.reservationService.releaseReservation(
            reservation.id,
            'Order cancelled by customer/system',
          );
        } else {
          result = { status: 'NO_ACTIVE_HELD_RESERVATION', orderId };
        }
        break;
      }

      default:
        return { status: 'UNMAPPED_EVENT', eventType };
    }

    await this.markProcessed(eventId, eventType);
    return { status: 'PROCESSED', eventId, result };
  }
}

export const orderEventWorker = new OrderEventWorker();
