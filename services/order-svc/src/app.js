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
import { createCartRouter } from './routes/cart.routes.js';
import { createCheckoutRouter } from './routes/checkout.routes.js';
import { createOrderRouter } from './routes/order.routes.js';

export function createApp({ cartController, checkoutController, orderController } = {}) {
  const app = express();

  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'order-svc' }));

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
