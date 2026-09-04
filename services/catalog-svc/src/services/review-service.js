import { BadRequestError } from '@ecommerce/shared';

import { ReviewRepository } from '../repositories/review.repository.js';

export class ReviewService {
  constructor(reviewRepository = new ReviewRepository()) {
    this.reviewRepository = reviewRepository;
  }

  /**
   * Submits a new product review
   */
  async createReview({ productId, userId, rating, title, comment }) {
    if (!productId) {
      throw new BadRequestError('productId is required');
    }
    if (!userId) {
      throw new BadRequestError('userId is required');
    }
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      throw new BadRequestError('Rating must be an integer between 1 and 5');
    }
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      throw new BadRequestError('Comment must be a non-empty string');
    }

    const { review, eventId } = await this.reviewRepository.createWithOutbox({
      productId,
      userId,
      rating: numRating,
      title: title ? title.trim() : null,
      comment: comment.trim(),
    });

    return { review, eventId };
  }

  /**
   * Retrieves paginated reviews for a product
   */
  async getProductReviews({ productId, page = 1, limit = 20 }) {
    if (!productId) {
      throw new BadRequestError('productId is required');
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    return await this.reviewRepository.findByProduct({
      productId,
      page: pageNum,
      limit: limitNum,
    });
  }

  /**
   * Handles review events from Kafka consumer to aggregate rating idempotently
   */
  async handleReviewEvent({
    eventId,
    eventType,
    productId,
    consumerGroup = 'catalog-review-group',
  }) {
    if (!productId || !eventId) {
      throw new BadRequestError('productId and eventId are required to process review event');
    }

    return await this.reviewRepository.recalculateAndRecordEvent({
      productId,
      consumerGroup,
      eventId,
      eventType: eventType || 'review.created',
    });
  }
}
