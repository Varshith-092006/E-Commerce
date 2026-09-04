import { KafkaConsumerGroup, KafkaTopics, logger as defaultLogger } from '@ecommerce/shared';

import { kafkaDlqService as defaultDlqService } from '../services/kafka-dlq.service.js';

export class KafkaDlqWorker {
  constructor({
    dlqService = defaultDlqService,
    groupId = 'notification-kafka-dlq-group',
    topics = [KafkaTopics.DEAD_LETTER_EVENTS],
    logger = defaultLogger,
  } = {}) {
    this.dlqService = dlqService;
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
    return await this.dlqService.recordDlqEvent(event);
  }
}

export const kafkaDlqWorker = new KafkaDlqWorker();
