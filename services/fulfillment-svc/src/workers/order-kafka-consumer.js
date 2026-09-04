import {
  KafkaConsumerGroup,
  KafkaTopics,
  KafkaConsumerGroups,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { orderEventWorker } from './order-event.worker.js';

export class OrderKafkaConsumer {
  constructor({
    worker = orderEventWorker,
    groupId = KafkaConsumerGroups.FULFILLMENT_ORDER,
    topics = [KafkaTopics.ORDER_EVENTS],
    logger = defaultLogger,
  } = {}) {
    this.worker = worker;
    this.groupId = groupId;
    this.topics = topics;
    this.logger = logger;

    this.consumerGroup = new KafkaConsumerGroup({
      groupId: this.groupId,
      topics: this.topics,
      serviceName: 'fulfillment-svc',
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
    // Forward event to existing orderEventWorker for execution
    const formattedEvent = {
      eventId: event.eventId,
      eventType: event.eventType,
      sourceService: event.sourceService,
      payload: event.payload || {},
    };
    return await this.worker.processEvent(formattedEvent);
  }
}

export const orderKafkaConsumer = new OrderKafkaConsumer();
