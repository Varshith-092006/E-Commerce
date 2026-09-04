import { Router } from 'express';
import {
  authenticate,
  optionalAuthenticate,
  requireRole,
  Roles,
  createRateLimiter,
  PlatformPolicies,
} from '@ecommerce/shared';

import { returnPickupController as defaultReturnController } from '../controllers/return-pickup.controller.js';

export function createReturnPickupRouter({
  controller = defaultReturnController,
  returnCreationLimiter,
} = {}) {
  const router = Router();

  const limiter =
    returnCreationLimiter ||
    createRateLimiter({
      limit: PlatformPolicies.RATE_LIMIT_RETURNS || 5,
      windowSeconds: 60,
      skip: () => process.env.NODE_ENV === 'test' && !returnCreationLimiter,
    });

  // Public / optional auth tracking timeline
  router.get('/tracking/:trackingNumber', optionalAuthenticate, controller.getTrackingTimeline);

  // Authenticated return endpoints
  router.use(authenticate);

  // Customer or Admin: Request return pickup
  router.post('/', requireRole(Roles.CUSTOMER, Roles.ADMIN), limiter, controller.requestReturn);

  // Logistics / Admin: Schedule pickup
  router.post(
    '/:id/schedule',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.schedulePickup,
  );

  // Logistics / Courier: Record Proof of Pickup
  router.post(
    '/:id/pickup',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.recordProofOfPickup,
  );

  // Logistics / Courier: Tracking updates
  router.post(
    '/:id/track',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.updateTrackingCheckpoint,
  );

  // Logistics / Courier / Admin: Receive package at warehouse
  router.post(
    '/:id/receive',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.receiveAtWarehouse,
  );

  // Logistics / Courier / Admin: Quality inspection and PASS restocking
  router.post(
    '/:id/inspect',
    requireRole(Roles.ADMIN, Roles.LOGISTICS, Roles.COURIER),
    controller.inspectAndRestock,
  );

  // Return query list
  router.get('/admin/summary', controller.getAdminSummary);
  router.get('/', controller.listReturns);

  // Return details (IDOR protected in service)
  router.get('/:id', controller.getReturnById);

  return router;
}

export const returnPickupRouter = createReturnPickupRouter();
