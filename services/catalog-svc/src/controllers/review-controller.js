import { successResponse, BadRequestError } from '@ecommerce/shared';

import { ReviewService } from '../services/review-service.js';

export class ReviewController {
  constructor(reviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  createReview = async (req, res, next) => {
    try {
      const productId = req.params.id || req.body.productId;
      const userId = req.user?.id;

      if (!userId) {
        throw new BadRequestError('User context required to submit review');
      }

      const { rating, title, comment } = req.body;

      const { review } = await this.reviewService.createReview({
        productId,
        userId,
        rating,
        title,
        comment,
      });

      return res.status(201).json(
        successResponse({
          data: review,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  getProductReviews = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { page, limit } = req.query;

      const result = await this.reviewService.getProductReviews({
        productId,
        page,
        limit,
      });

      return res.status(200).json(
        successResponse({
          data: result.items,
          meta: result.pagination,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
