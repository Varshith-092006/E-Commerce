import { successResponse } from '@ecommerce/shared';
import express from 'express';

import { config } from '../config/index.js';
import { checkRedisHealth as defaultCheckRedisHealth } from '../lib/redis.js';

export function createHealthRouter({ checkHealth = defaultCheckRedisHealth } = {}) {
  const router = express.Router();

  router.get('/health', async (req, res) => {
    const isRedisHealthy = await checkHealth();

    const services = {
      gateway: { status: 'healthy', port: config.port },
      redis: { status: isRedisHealthy ? 'connected' : 'unreachable' },
      downstream: {
        identitySvc: { url: config.services.identity },
        catalogSvc: { url: config.services.catalog },
        orderSvc: { url: config.services.order },
        paymentSvc: { url: config.services.payment },
        fulfillmentSvc: { url: config.services.fulfillment },
        notificationSvc: { url: config.services.notification },
      },
    };

    const isHealthy = isRedisHealthy;

    return res.status(isHealthy ? 200 : 503).json(
      successResponse({
        data: {
          status: isHealthy ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
          services,
        },
        requestId: req.id,
      }),
    );
  });

  return router;
}

export const healthRouter = createHealthRouter();
