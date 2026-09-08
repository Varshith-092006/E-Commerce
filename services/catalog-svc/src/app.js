import express from 'express';
import {
  requestIdMiddleware,
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
  metricsMiddleware,
  metricsEndpoint,
  createServiceHealthRouter,
  getRedisClient,
  createRequestLimitsMiddleware,
} from '@ecommerce/shared';

import { config } from './config/index.js';
import { prisma } from './lib/prisma.js';
import { createCategoryRoutes } from './routes/category-routes.js';
import { createProductRoutes } from './routes/product-routes.js';
import { createSellerProductRoutes } from './routes/seller-product-routes.js';
import { createWishlistRoutes } from './routes/wishlist-routes.js';
import { createCouponRouter } from './routes/coupon.routes.js';
import { createReviewRoutes } from './routes/review-routes.js';

export function createApp({ getIsShuttingDown = () => false } = {}) {
  const app = express();

  app.use(createRequestLimitsMiddleware({ jsonLimit: '1mb', urlEncodedLimit: '1mb' }));
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'catalog-svc' }));

  // Metrics endpoint
  app.get('/metrics', metricsEndpoint);

  // Standardized Health, Readiness, and Liveness probes
  app.use(
    createServiceHealthRouter({
      serviceName: config.serviceName,
      getIsShuttingDown,
      checkReadiness: async () => {
        if (process.env.NODE_ENV === 'test') {
          return { db: 'ok', redis: 'ok' };
        }
        const checks = { db: 'ok', redis: 'ok' };
        try {
          await prisma.$queryRaw`SELECT 1`;
        } catch {
          checks.db = 'failed';
        }
        try {
          const redis = getRedisClient();
          if (redis && typeof redis.ping === 'function') {
            await redis.ping();
          }
        } catch {
          checks.redis = 'failed';
        }
        return checks;
      },
    }),
  );

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
