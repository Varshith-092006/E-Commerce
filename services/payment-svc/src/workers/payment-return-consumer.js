import {
  KafkaConsumerGroup,
  KafkaTopics,
  KafkaConsumerGroups,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { returnRefundWorker } from './return-refund.worker.js';

export class PaymentReturnConsumer {
  constructor({
    worker = returnRefundWorker,
    groupId = KafkaConsumerGroups.PAYMENT_RETURN,
    topics = [KafkaTopics.FULFILLMENT_EVENTS],
    logger = defaultLogger,
  } = {}) {
    this.worker = worker;
    this.groupId = groupId;
    this.topics = topics;
    this.logger = logger;

    this.consumerGroup = new KafkaConsumerGroup({
      groupId: this.groupId,
      topics: this.topics,
      serviceName: 'payment-svc',
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

export const paymentReturnConsumer = new PaymentReturnConsumer();
