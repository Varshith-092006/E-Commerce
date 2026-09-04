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
import { notificationRouter } from './routes/notification.routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'notification-svc' }));

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

  // Mount notification routes
  app.use('/api/v1/notifications', notificationRouter);
  app.use('/notifications', notificationRouter);

  // 404 Fallback
  app.use(notFoundHandlerMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
