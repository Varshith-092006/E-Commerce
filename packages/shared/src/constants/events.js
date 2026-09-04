export const EventTypes = Object.freeze({
  // order-events
  ORDER_PLACED: 'order.placed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_CANCELLATION_REQUESTED: 'order.cancellationRequested',
  ORDER_RETURN_APPROVED: 'order.returnApproved',
  ORDER_DELIVERED: 'order.delivered',

  // payment-events
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED: 'payment.captured',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',

  // inventory-events
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_COMMITTED: 'inventory.committed',
  INVENTORY_RESERVATION_FAILED: 'inventory.reservationFailed',
  INVENTORY_RELEASED: 'inventory.released',
  INVENTORY_ADJUSTED: 'inventory.adjusted',
  INVENTORY_LOW_STOCK: 'inventory.low_stock',

  // fulfillment-events
  FULFILLMENT_ALLOCATED: 'fulfillment.allocated',
  SHIPMENT_CREATED: 'shipment.created',
  SHIPMENT_SHIPPED: 'shipment.shipped',
  SHIPMENT_DELIVERED: 'shipment.delivered',

  // return-events
  RETURN_REQUESTED: 'return.requested',
  RETURN_APPROVED: 'return.approved',
  RETURN_REJECTED: 'return.rejected',
  RETURN_PICKED_UP: 'return.pickedUp',
  RETURN_RECEIVED: 'return.received',
  RETURN_REFUND_INITIATED: 'return.refundInitiated',
  RETURN_COMPLETED: 'return.completed',

  // review-events
  REVIEW_CREATED: 'review.created',
  REVIEW_UPDATED: 'review.updated',
  REVIEW_DELETED: 'review.deleted',
});
