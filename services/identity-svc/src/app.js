import express from 'express';
import cookieParser from 'cookie-parser';
import {
  requestIdMiddleware,
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
  successResponse,
  metricsMiddleware,
  metricsEndpoint,
} from '@ecommerce/shared';

import { config } from './config/index.js';
import { createAuthRoutes } from './routes/auth-routes.js';
import { createUserRoutes } from './routes/user-routes.js';
import { createSellerRoutes } from './routes/seller-routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'identity-svc' }));

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
