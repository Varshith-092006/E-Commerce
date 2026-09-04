import { Router } from 'express';
import { authenticate, optionalAuthenticate, requireRole, Roles } from '@ecommerce/shared';

import { shipmentController as defaultShipmentController } from '../controllers/shipment.controller.js';

export function createShipmentRouter({ controller = defaultShipmentController } = {}) {
  const router = Router();

  // Public / optional auth tracking timeline
  router.get('/tracking/:trackingNumber', optionalAuthenticate, controller.getTrackingTimeline);

  // Authenticated shipment management endpoints
  router.use(authenticate);

  // ADMIN / Internal: Multi-Warehouse Allocation
  router.post('/allocate', requireRole(Roles.ADMIN), controller.allocateShipments);

  // Packing
  router.post(
    '/:id/pack',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER, Roles.SELLER),
    controller.packShipment,
  );

  // Dispatching
  router.post(
    '/:id/dispatch',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.dispatchShipment,
  );

  // Checkpoint Tracking Updates
  router.post(
    '/:id/track',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.updateTrackingCheckpoint,
  );

  // Proof of Delivery Completion
  router.post(
    '/:id/deliver',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.completeDelivery,
  );

  // Shipment List
  router.get('/', controller.listShipments);

  // Shipment Details (IDOR protected in service)
  router.get('/:id', controller.getShipmentById);

  return router;
}

export const shipmentRouter = createShipmentRouter();
