import {
  KafkaConsumerGroup,
  KafkaTopics,
  KafkaConsumerGroups,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { notificationEventWorker } from './notification-event.worker.js';

export class NotificationKafkaConsumer {
  constructor({
    worker = notificationEventWorker,
    groupId = KafkaConsumerGroups.NOTIFICATION,
    topics = [
      KafkaTopics.ORDER_EVENTS,
      KafkaTopics.PAYMENT_EVENTS,
      KafkaTopics.FULFILLMENT_EVENTS,
      KafkaTopics.NOTIFICATION_EVENTS,
    ],
    logger = defaultLogger,
  } = {}) {
    this.worker = worker;
    this.groupId = groupId;
    this.topics = topics;
    this.logger = logger;

    this.consumerGroup = new KafkaConsumerGroup({
      groupId: this.groupId,
      topics: this.topics,
      serviceName: 'notification-svc',
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

export const notificationKafkaConsumer = new NotificationKafkaConsumer();
