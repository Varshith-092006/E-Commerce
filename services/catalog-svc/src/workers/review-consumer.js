import {
  KafkaConsumerGroup,
  KafkaTopics,
  KafkaConsumerGroups,
  logger as defaultLogger,
} from '@ecommerce/shared';

import { ReviewService } from '../services/review-service.js';

export class ReviewConsumer {
  constructor({
    reviewService = new ReviewService(),
    groupId = KafkaConsumerGroups.CATALOG_REVIEW || 'catalog-review-group',
    topics = [KafkaTopics.REVIEW_EVENTS || 'ecommerce.review-events'],
    logger = defaultLogger,
  } = {}) {
    this.reviewService = reviewService;
    this.groupId = groupId;
    this.topics = topics;
    this.logger = logger;

    this.consumerGroup = new KafkaConsumerGroup({
      groupId: this.groupId,
      topics: this.topics,
      serviceName: 'catalog-svc',
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
    const { eventId, eventType, payload } = event;
    const productId = payload?.productId;

    if (!productId) {
      this.logger.warn({ eventId, eventType }, 'Review event missing productId');
      return { skipped: true };
    }

    return await this.reviewService.handleReviewEvent({
      eventId,
      eventType,
      productId,
      consumerGroup: this.groupId,
    });
  }
}

export const reviewConsumer = new ReviewConsumer();
