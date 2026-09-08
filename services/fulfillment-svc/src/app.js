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
import { createFulfillmentRouter } from './routes/fulfillment.routes.js';
import { createWarehouseRouter } from './routes/warehouse.routes.js';
import { createInventoryRouter } from './routes/inventory.routes.js';
import { createReservationRouter } from './routes/reservation.routes.js';
import { createShipmentRouter } from './routes/shipment.routes.js';
import { createReturnPickupRouter } from './routes/return-pickup.routes.js';

export function createApp({
  warehouseController,
  inventoryController,
  reservationController,
  shipmentController,
  returnPickupController,
  getIsShuttingDown = () => false,
} = {}) {
  const app = express();

  app.use(createRequestLimitsMiddleware({ jsonLimit: '1mb', urlEncodedLimit: '1mb' }));
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'fulfillment-svc' }));

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

  // Primary API endpoints under /api/v1/fulfillment
  app.use(
    '/api/v1/fulfillment',
    createFulfillmentRouter({
      warehouseController,
      inventoryController,
      reservationController,
      shipmentController,
      returnPickupController,
    }),
  );

  // Direct route aliases for microservice mesh flexibility
  app.use('/api/v1/warehouses', createWarehouseRouter({ controller: warehouseController }));
  app.use('/api/v1/inventory', createInventoryRouter({ controller: inventoryController }));
  app.use('/api/v1/reservations', createReservationRouter({ controller: reservationController }));
  app.use('/api/v1/shipments', createShipmentRouter({ controller: shipmentController }));
  app.use('/api/v1/returns', createReturnPickupRouter({ controller: returnPickupController }));

  // 404 Fallback
  app.use(notFoundHandlerMiddleware);

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
