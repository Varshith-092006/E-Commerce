import { Router } from 'express';

import { createWarehouseRouter } from './warehouse.routes.js';
import { createInventoryRouter } from './inventory.routes.js';
import { createReservationRouter } from './reservation.routes.js';
import { createShipmentRouter } from './shipment.routes.js';
import { createReturnPickupRouter } from './return-pickup.routes.js';

export function createFulfillmentRouter({
  warehouseController,
  inventoryController,
  reservationController,
  shipmentController,
  returnPickupController,
} = {}) {
  const router = Router();

  router.use('/warehouses', createWarehouseRouter({ controller: warehouseController }));
  router.use('/inventory', createInventoryRouter({ controller: inventoryController }));
  router.use('/reservations', createReservationRouter({ controller: reservationController }));
  router.use('/shipments', createShipmentRouter({ controller: shipmentController }));
  router.use('/returns', createReturnPickupRouter({ controller: returnPickupController }));

  return router;
}

export const fulfillmentRouter = createFulfillmentRouter();
