export const KafkaTopics = Object.freeze({
  ORDER_EVENTS: 'ecommerce.order-events',
  PAYMENT_EVENTS: 'ecommerce.payment-events',
  FULFILLMENT_EVENTS: 'ecommerce.fulfillment-events',
  NOTIFICATION_EVENTS: 'ecommerce.notification-events',
  DEAD_LETTER_EVENTS: 'ecommerce.dead-letter-events',
  REVIEW_EVENTS: 'ecommerce.review-events',
});

export const KafkaConsumerGroups = Object.freeze({
  FULFILLMENT_ORDER: process.env.KAFKA_GROUP_FULFILLMENT_ORDER || 'fulfillment-order-group',
  FULFILLMENT_PAYMENT: process.env.KAFKA_GROUP_FULFILLMENT_PAYMENT || 'fulfillment-payment-group',
  ORDER_SAGA: process.env.KAFKA_GROUP_ORDER_SAGA || 'order-saga-group',
  NOTIFICATION: process.env.KAFKA_GROUP_NOTIFICATION || 'notification-group',
  PAYMENT_RETURN: process.env.KAFKA_GROUP_PAYMENT_RETURN || 'payment-return-group',
  CATALOG_REVIEW: process.env.KAFKA_GROUP_CATALOG_REVIEW || 'catalog-review-group',
});
