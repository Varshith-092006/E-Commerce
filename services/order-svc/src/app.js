import express from 'express';
import {
  requestIdMiddleware,
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
  metricsMiddleware,
  metricsEndpoint,
  createServiceHealthRouter,
  getRedisClient,
  kafkaClient,
  createRequestLimitsMiddleware,
} from '@ecommerce/shared';

import { config } from './config/index.js';
import { prisma } from './lib/prisma.js';
import { createCartRouter } from './routes/cart.routes.js';
import { createCheckoutRouter } from './routes/checkout.routes.js';
import { createOrderRouter } from './routes/order.routes.js';

export function createApp({
  cartController,
  checkoutController,
  orderController,
  getIsShuttingDown = () => false,
} = {}) {
  const app = express();

  app.use(createRequestLimitsMiddleware({ jsonLimit: '1mb', urlEncodedLimit: '1mb' }));
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'order-svc' }));

  // Metrics endpoint
  app.get('/metrics', metricsEndpoint);

  // Standardized Health, Readiness, and Liveness probes
  app.use(
    createServiceHealthRouter({
      serviceName: config.serviceName,
      getIsShuttingDown,
      checkReadiness: async () => {
        if (process.env.NODE_ENV === 'test') {
          return { db: 'ok', redis: 'ok', kafka: 'ok' };
        }
        const checks = { db: 'ok', redis: 'ok', kafka: 'ok' };
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
        try {
          const kafkaHealth = await kafkaClient.checkHealth();
          checks.kafka = kafkaHealth.status;
        } catch {
          checks.kafka = 'unknown';
        }
        return checks;
      },
    }),
  );

  // Cart Routes
  app.use('/api/v1/cart', createCartRouter(cartController ? { controller: cartController } : {}));

  // Checkout Routes
  app.use(
    '/api/v1/checkout',
    createCheckoutRouter(checkoutController ? { controller: checkoutController } : {}),
  );

  // Order Routes & Seller Analytics
  const orderRouterInstance = createOrderRouter(
    orderController ? { controller: orderController } : {},
  );
  app.use('/api/v1/orders', orderRouterInstance);
  app.use('/api/v1/seller', orderRouterInstance);

  // 404 Fallback
  app.use(notFoundHandlerMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
