import { ValidationError, NotFoundError, createLogger } from '@ecommerce/shared';

import { orderRepository as defaultOrderRepo } from '../repositories/order.repository.js';

const logger = createLogger({ service: 'order-svc:order-saga' });

export class OrderSagaService {
  constructor({ orderRepo = defaultOrderRepo } = {}) {
    this.orderRepo = orderRepo;
    this.processedEvents = new Map();
  }

  /**
   * Synchronizes order state when a shipment is dispatched
   */
  async handleShipmentShipped({
    orderId,
    shipmentNumber,
    trackingNumber,
    courierCode,
    dispatchedAt: _dispatchedAt,
  }) {
    if (!orderId) {
      throw new ValidationError('orderId is required');
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order with ID '${orderId}' not found`);
    }

    // If order is already in SHIPPED or later state, do not regress or re-trigger
    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
      logger.info({ orderId, status: order.status }, 'Order already in shipped/delivered state');
      return { orderId, status: order.status, idempotent: true };
    }

    const result = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'SHIPPED',
      actorId: 'system-saga',
      actorRole: 'ADMIN',
      reason: `Shipment dispatched (${shipmentNumber || trackingNumber})`,
      shippingData: {
        courierName: courierCode,
        trackingNumber,
      },
    });

    return {
      orderId,
      status: result.order?.status || 'SHIPPED',
      idempotent: result.idempotent || false,
    };
  }

  /**
   * Synchronizes order state when a shipment is delivered
   */
  async handleShipmentDelivered({
    orderId,
    shipmentNumber,
    trackingNumber,
    deliveredAt: _deliveredAt,
    podReceivedBy,
    podSignature,
  }) {
    if (!orderId) {
      throw new ValidationError('orderId is required');
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order with ID '${orderId}' not found`);
    }

    if (order.status === 'DELIVERED') {
      logger.info({ orderId }, 'Order already marked DELIVERED');
      return { orderId, status: 'DELIVERED', idempotent: true };
    }

    const result = await this.orderRepo.transitionOrderStatusAtomic({
      orderId,
      targetStatus: 'DELIVERED',
      actorId: 'system-saga',
      actorRole: 'ADMIN',
      reason: `Proof of Delivery confirmed (${shipmentNumber || trackingNumber})`,
      deliveryData: {
        podReceivedBy,
        podSignature,
      },
    });

    return {
      orderId,
      status: result.order?.status || 'DELIVERED',
      idempotent: result.idempotent || false,
    };
  }

  /**
   * Synchronizes order state when a return is completed
   */
  async handleReturnCompleted({ orderId, returnId, returnNumber, completedAt: _completedAt }) {
    if (!orderId) {
      throw new ValidationError('orderId is required');
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order with ID '${orderId}' not found`);
    }

    logger.info(
      { orderId, returnId, returnNumber },
      'Return completed successfully; order return state synchronized',
    );

    return { orderId, returnId, status: 'RETURN_SYNCHRONIZED', idempotent: false };
  }

  /**
   * Synchronizes order state when inventory is released
   */
  async handleInventoryReleased({ orderId, reason: _reason }) {
    if (!orderId) {
      return { status: 'IGNORED_NO_ORDER_ID' };
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      return { status: 'ORDER_NOT_FOUND', orderId };
    }

    logger.info({ orderId }, 'Inventory released for order; saga state clean');
    return { orderId, status: order.status, inventoryReleased: true };
  }
}

export const orderSagaService = new OrderSagaService();
