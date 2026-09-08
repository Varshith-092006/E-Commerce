import express from 'express';
import cookieParser from 'cookie-parser';
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
import { createAuthRoutes } from './routes/auth-routes.js';
import { createUserRoutes } from './routes/user-routes.js';
import { createSellerRoutes } from './routes/seller-routes.js';

export function createApp({ getIsShuttingDown = () => false } = {}) {
  const app = express();

  app.use(createRequestLimitsMiddleware({ jsonLimit: '1mb', urlEncodedLimit: '1mb' }));
  app.use(cookieParser());
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'identity-svc' }));

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

  // Identity routes
  app.use('/api/v1/auth', createAuthRoutes());
  app.use('/api/v1/users', createUserRoutes());
  app.use('/api/v1/sellers', createSellerRoutes());

  // 404 Fallback
  app.use(notFoundHandlerMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
