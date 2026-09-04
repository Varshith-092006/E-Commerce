import express from 'express';
import {
  requestIdMiddleware,
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
  successResponse,
  metricsMiddleware,
  metricsEndpoint,
} from '@ecommerce/shared';

import { config } from './config/index.js';
import { createCategoryRoutes } from './routes/category-routes.js';
import { createProductRoutes } from './routes/product-routes.js';
import { createSellerProductRoutes } from './routes/seller-product-routes.js';
import { createWishlistRoutes } from './routes/wishlist-routes.js';
import { createCouponRouter } from './routes/coupon.routes.js';
import { createReviewRoutes } from './routes/review-routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'catalog-svc' }));

  // Metrics endpoint
  app.get('/metrics', metricsEndpoint);

  // Health check endpoint
  app.get('/health', (req, res) => {
    return res.status(200).json(
      successResponse({
        data: {
          service: config.serviceName,
          status: 'healthy',
          timestamp: new Date().toISOString(),
          port: config.port,
        },
        requestId: req.id,
      }),
    );
  });

  // Catalog routes
  app.use('/api/v1/categories', createCategoryRoutes());
  app.use('/api/v1/products', createProductRoutes());
  app.use('/api/v1/seller/products', createSellerProductRoutes());
  app.use('/api/v1/wishlist', createWishlistRoutes());
  app.use('/api/v1/coupons', createCouponRouter());
  app.use('/api/v1/reviews', createReviewRoutes());

  // 404 Fallback
  app.use(notFoundHandlerMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
