import { ValidationError, EventTypes, logger } from '@ecommerce/shared';

import { inventoryReservationService as defaultReservationService } from '../services/inventory-reservation.service.js';
import { shipmentService as defaultShipmentService } from '../services/shipment.service.js';
import { reservationRepository as defaultReservationRepo } from '../repositories/reservation.repository.js';
import { shipmentRepository as defaultShipmentRepo } from '../repositories/shipment.repository.js';
import { prisma as defaultPrisma } from '../lib/prisma.js';

export class PaymentEventWorker {
  constructor({
    reservationService = defaultReservationService,
    shipmentService = defaultShipmentService,
    reservationRepo = defaultReservationRepo,
    shipmentRepo = defaultShipmentRepo,
    prismaClient = defaultPrisma,
    consumerName = 'fulfillment-payment-event-worker',
  } = {}) {
    this.reservationService = reservationService;
    this.shipmentService = shipmentService;
    this.reservationRepo = reservationRepo;
    this.shipmentRepo = shipmentRepo;
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
   * Processes payment events to commit/release inventory reservations and trigger multi-warehouse shipment allocation
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
      logger.info({ eventId, eventType }, 'Payment event already processed; skipping duplicate');
      return { status: 'SKIPPED_DUPLICATE', eventId };
    }

    let result;

    switch (eventType) {
      case EventTypes.PAYMENT_CAPTURED:
      case 'payment.captured': {
        const orderId = payload.orderId || payload.order_id;
        const userId = payload.userId || payload.user_id;
        const shippingAddress = payload.shippingAddress ||
          payload.shipping_address || {
            city: 'Standard City',
            state: 'Standard State',
            postalCode: '560001',
          };
        const items = payload.items || [];

        if (!orderId) {
          throw new ValidationError('orderId required for payment.captured processing');
        }

        const reservationKey = `res_ord_${orderId}`;
        let reservation = await this.reservationRepo.findByReservationKey(reservationKey);

        // 1. If reservation exists in HELD state, commit it
        if (reservation && reservation.status === 'HELD') {
          reservation = await this.reservationService.commitReservation(reservation.id);
        }

        // 2. Prevent duplicate shipment creation
        const existingShipments = await this.shipmentRepo.findByOrderId(orderId);
        if (existingShipments && existingShipments.length > 0) {
          result = {
            status: 'ALREADY_ALLOCATED',
            orderId,
            shipmentCount: existingShipments.length,
          };
        } else {
          // 3. Allocate and create shipment(s)
          result = await this.shipmentService.allocateAndCreateShipment({
            orderId,
            userId: userId || reservation?.user_id,
            reservationId: reservation?.id,
            shippingAddress,
            items,
          });
        }
        break;
      }

      case EventTypes.PAYMENT_FAILED:
      case 'payment.failed': {
        const orderId = payload.orderId || payload.order_id;
        if (!orderId) {
          throw new ValidationError('orderId required for payment.failed processing');
        }

        const reservation = await this.reservationRepo.findByReservationKey(`res_ord_${orderId}`);
        if (reservation && reservation.status === 'HELD') {
          result = await this.reservationService.releaseReservation(
            reservation.id,
            'Payment failed for checkout order',
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

export const paymentEventWorker = new PaymentEventWorker();
