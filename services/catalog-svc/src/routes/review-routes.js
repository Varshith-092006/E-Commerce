import { Router } from 'express';
import { authenticate } from '@ecommerce/shared';

import { ReviewController } from '../controllers/review-controller.js';

export function createReviewRoutes(reviewController = new ReviewController()) {
  const router = Router();

  // Public: Read reviews for a product
  router.get('/product/:id', reviewController.getProductReviews);

  // Protected: Submit review
  router.post('/', authenticate, reviewController.createReview);

  return router;
}
