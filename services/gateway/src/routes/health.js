import { successResponse } from '@ecommerce/shared';
import express from 'express';

import { config } from '../config/index.js';
import { checkRedisHealth as defaultCheckRedisHealth } from '../lib/redis.js';

export function createHealthRouter({
  checkHealth = defaultCheckRedisHealth,
  getIsShuttingDown = () => false,
} = {}) {
  const router = express.Router();

  // Liveness probe: is gateway process up and event loop responsive?
  router.get('/liveness', (req, res) => {
    return res.status(200).json({
      status: 'UP',
      alive: true,
      service: 'gateway',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Readiness probe: can gateway accept incoming client traffic?
  router.get('/ready', async (req, res) => {
    if (getIsShuttingDown && getIsShuttingDown()) {
      return res.status(503).json({
        status: 'SHUTTING_DOWN',
        ready: false,
        service: 'gateway',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const isRedisHealthy = await checkHealth();
      if (!isRedisHealthy) {
        return res.status(503).json({
          status: 'NOT_READY',
          ready: false,
          service: 'gateway',
          redis: 'unreachable',
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        status: 'READY',
        ready: true,
        service: 'gateway',
        redis: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(503).json({
        status: 'NOT_READY',
        ready: false,
        service: 'gateway',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Backward-compatible aggregated health check
  router.get('/health', async (req, res) => {
    const isRedisHealthy = await checkHealth();
    const isShuttingDown = getIsShuttingDown ? getIsShuttingDown() : false;

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

    const isHealthy = isRedisHealthy && !isShuttingDown;

    return res.status(isHealthy ? 200 : 503).json(
      successResponse({
        data: {
          status: isHealthy ? 'healthy' : isShuttingDown ? 'shutting_down' : 'degraded',
          ready: isHealthy,
          alive: true,
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
