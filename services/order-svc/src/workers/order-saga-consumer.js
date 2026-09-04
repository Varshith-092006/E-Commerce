import {
  KafkaConsumerGroup,
  KafkaTopics,
  KafkaConsumerGroups,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { orderSagaWorker } from './order-saga.worker.js';

export class OrderSagaConsumer {
  constructor({
    worker = orderSagaWorker,
    groupId = KafkaConsumerGroups.ORDER_SAGA,
    topics = [KafkaTopics.PAYMENT_EVENTS, KafkaTopics.FULFILLMENT_EVENTS],
    logger = defaultLogger,
  } = {}) {
    this.worker = worker;
    this.groupId = groupId;
    this.topics = topics;
    this.logger = logger;

    this.consumerGroup = new KafkaConsumerGroup({
      groupId: this.groupId,
      topics: this.topics,
      serviceName: 'order-svc',
      handler: this.handleKafkaMessage.bind(this),
      logger: this.logger,
    });
  }

  async start() {
    await this.consumerGroup.start();
  }

  async stop() {
    await this.consumerGroup.stop();
  }

  async handleKafkaMessage({ event }) {
    const formattedEvent = {
      eventId: event.eventId,
      eventType: event.eventType,
      sourceService: event.sourceService,
      payload: event.payload || {},
    };
    return await this.worker.processEvent(formattedEvent);
  }
}

export const orderSagaConsumer = new OrderSagaConsumer();
