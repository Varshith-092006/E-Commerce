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
import { createPaymentRouter } from './routes/payment.routes.js';

export function createApp({ paymentController, getIsShuttingDown = () => false } = {}) {
  const app = express();

  // Phase 3: Bounded request limits while capturing exact rawBody for webhook HMAC verification
  app.use(
    createRequestLimitsMiddleware({
      jsonLimit: '1mb',
      urlEncodedLimit: '1mb',
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'payment-svc' }));

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

  // Payment Routes
  app.use(
    '/api/v1/payments',
    createPaymentRouter(paymentController ? { controller: paymentController } : {}),
  );
  app.use(
    '/api/v1/refunds',
    createPaymentRouter(paymentController ? { controller: paymentController } : {}),
  );

  // 404 Fallback
  app.use(notFoundHandlerMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
