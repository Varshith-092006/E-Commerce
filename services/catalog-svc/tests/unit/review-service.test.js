import { jest } from '@jest/globals';
import { ReviewService } from '../../src/services/review-service.js';
import { BadRequestError } from '@ecommerce/shared';

describe('ReviewService Unit & Event Aggregation Tests', () => {
  let reviewService;
  let mockReviewRepo;

  beforeEach(() => {
    mockReviewRepo = {
      createWithOutbox: jest.fn(),
      findByProduct: jest.fn(),
      aggregateRating: jest.fn(),
      recalculateAndRecordEvent: jest.fn(),
    };

    reviewService = new ReviewService(mockReviewRepo);
  });

  describe('createReview', () => {
    it('should create review and append outbox event successfully', async () => {
      mockReviewRepo.createWithOutbox.mockResolvedValue({
        review: {
          id: 'rev-1',
          product_id: 'prod-1',
          user_id: 'user-1',
          rating: 5,
          title: 'Great product',
          comment: 'Works perfectly and arrived quickly.',
        },
        eventId: 'evt-123',
      });

      const result = await reviewService.createReview({
        productId: 'prod-1',
        userId: 'user-1',
        rating: 5,
        title: 'Great product',
        comment: 'Works perfectly and arrived quickly.',
      });

      expect(result.review.id).toBe('rev-1');
      expect(result.eventId).toBe('evt-123');
      expect(mockReviewRepo.createWithOutbox).toHaveBeenCalledWith({
        productId: 'prod-1',
        userId: 'user-1',
        rating: 5,
        title: 'Great product',
        comment: 'Works perfectly and arrived quickly.',
      });
    });

    it('should reject invalid rating below 1 or above 5', async () => {
      await expect(
        reviewService.createReview({
          productId: 'prod-1',
          userId: 'user-1',
          rating: 6,
          comment: 'Invalid rating test',
        }),
      ).rejects.toThrow(BadRequestError);

      await expect(
        reviewService.createReview({
          productId: 'prod-1',
          userId: 'user-1',
          rating: 0,
          comment: 'Invalid rating test',
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it('should reject empty comment', async () => {
      await expect(
        reviewService.createReview({
          productId: 'prod-1',
          userId: 'user-1',
          rating: 4,
          comment: '   ',
        }),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('handleReviewEvent (Aggregation & Idempotency)', () => {
    it('should recalculate product rating and total reviews on event', async () => {
      mockReviewRepo.recalculateAndRecordEvent.mockResolvedValue({
        alreadyProcessed: false,
        productId: 'prod-1',
        averageRating: 4.5,
        totalReviews: 2,
        product: { id: 'prod-1', average_rating: 4.5, total_reviews: 2 },
      });

      const result = await reviewService.handleReviewEvent({
        eventId: 'evt-123',
        eventType: 'review.created',
        productId: 'prod-1',
        consumerGroup: 'catalog-review-group',
      });

      expect(result.alreadyProcessed).toBe(false);
      expect(result.averageRating).toBe(4.5);
      expect(result.totalReviews).toBe(2);
      expect(mockReviewRepo.recalculateAndRecordEvent).toHaveBeenCalledWith({
        productId: 'prod-1',
        consumerGroup: 'catalog-review-group',
        eventId: 'evt-123',
        eventType: 'review.created',
      });
    });

    it('should be idempotent and not recalculate when duplicate event is received', async () => {
      mockReviewRepo.recalculateAndRecordEvent.mockResolvedValue({
        alreadyProcessed: true,
      });

      const result = await reviewService.handleReviewEvent({
        eventId: 'evt-123',
        eventType: 'review.created',
        productId: 'prod-1',
        consumerGroup: 'catalog-review-group',
      });

      expect(result.alreadyProcessed).toBe(true);
    });
  });
});
