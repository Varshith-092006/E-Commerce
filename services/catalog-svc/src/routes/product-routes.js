import { Router } from 'express';
import { authenticate } from '@ecommerce/shared';

import { ProductController } from '../controllers/product-controller.js';
import { ReviewController } from '../controllers/review-controller.js';

export function createProductRoutes(
  productController = new ProductController(),
  reviewController = new ReviewController(),
) {
  const router = Router();

  // Search & Autocomplete
  router.get('/search', productController.search);
  router.get('/autocomplete', productController.autocomplete);

  // Reviews for a product
  router.get('/:id/reviews', reviewController.getProductReviews);
  router.post('/:id/reviews', authenticate, reviewController.createReview);

  // Browse listing
  router.get('/', productController.browse);

  // Product details by ID or Slug
  router.get('/:idOrSlug', productController.getDetails);

  return router;
}
