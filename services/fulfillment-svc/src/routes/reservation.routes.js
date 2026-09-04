import { Router } from 'express';
import { authenticate, requireRole, Roles } from '@ecommerce/shared';

import { reservationController as defaultReservationController } from '../controllers/reservation.controller.js';

export function createReservationRouter({ controller = defaultReservationController } = {}) {
  const router = Router();

  router.use(authenticate);

  // Create reservation (Customer, Admin, Internal)
  router.post('/', controller.createReservation);

  // Commit reservation lifecycle
  router.post('/:id/commit', controller.commitReservation);
  router.post('/commit', controller.commitReservation);

  // Release reservation lifecycle
  router.post('/:id/release', controller.releaseReservation);
  router.post('/release', controller.releaseReservation);

  // Query reservation details (ownership validated in service)
  router.get('/by-key/:reservationKey', controller.getReservationByKey);
  router.get('/:id', controller.getReservationById);

  // Expiration sweeper trigger (Admin or internal systems)
  router.post('/expire-sweeper', requireRole(Roles.ADMIN), controller.expireStaleReservations);

  return router;
}

export const reservationRouter = createReservationRouter();
