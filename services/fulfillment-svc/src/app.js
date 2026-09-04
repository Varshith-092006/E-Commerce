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
} = {}) {
  const app = express();

  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware({ serviceName: 'fulfillment-svc' }));

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
