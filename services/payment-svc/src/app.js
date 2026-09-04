import express from 'express';
import {
  requestIdMiddleware,
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
  successResponse,
  metricsMiddleware,
  metricsEndpoint,
  kafkaClient,
} from '@ecommerce/shared';

import { config } from './config/index.js';
import { createPaymentRouter } from './routes/payment.routes.js';

export function createApp({ paymentController } = {}) {
  const app = express();

  // Capture exact rawBody for cryptographic webhook signature verification
  app.use(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'payment-svc' }));

  // Metrics endpoint
  app.get('/metrics', metricsEndpoint);

  // Health check endpoint
  app.get('/health', async (req, res) => {
    const kafkaHealth = await kafkaClient.checkHealth();
    return res.status(200).json(
      successResponse({
        data: {
          service: config.serviceName,
          status: 'healthy',
          timestamp: new Date().toISOString(),
          port: config.port,
          dependencies: {
            database: 'up',
            redis: 'up',
            kafka: kafkaHealth.status,
          },
        },
        requestId: req.id,
      }),
    );
  });

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
