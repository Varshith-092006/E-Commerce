import { successResponse, UnauthorizedError } from '@ecommerce/shared';

import { inventoryReservationService as defaultReservationService } from '../services/inventory-reservation.service.js';

export class ReservationController {
  constructor(reservationService = defaultReservationService) {
    this.reservationService = reservationService;
  }

  createReservation = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      if (!userId) {
        throw new UnauthorizedError('Authentication required to reserve inventory');
      }

      const { reservation, isIdempotent } = await this.reservationService.createReservation({
        reservationKey: req.body.reservationKey || req.body.reservation_key,
        userId,
        orderId: req.body.orderId || req.body.order_id,
        ttlSeconds: req.body.ttlSeconds || req.body.ttl_seconds,
        items: req.body.items,
        userRole: req.user?.role,
      });

      const statusCode = isIdempotent ? 200 : 201;
      return res.status(statusCode).json(
        successResponse({
          data: reservation,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  commitReservation = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      const committed = await this.reservationService.commitReservation({
        reservationId: req.params.id || req.body.reservationId || req.body.reservation_id,
        reservationKey: req.body.reservationKey || req.body.reservation_key,
        userId,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: committed,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  releaseReservation = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      const released = await this.reservationService.releaseReservation({
        reservationId: req.params.id || req.body.reservationId || req.body.reservation_id,
        reservationKey: req.body.reservationKey || req.body.reservation_key,
        userId,
        userRole: req.user?.role,
        reason: req.body.reason || 'MANUAL_RELEASE',
      });

      return res.status(200).json(
        successResponse({
          data: released,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getReservationById = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      const reservation = await this.reservationService.getReservationById(req.params.id, {
        userId,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: reservation,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getReservationByKey = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      const reservation = await this.reservationService.getReservationByKey(
        req.params.reservationKey || req.params.key,
        {
          userId,
          userRole: req.user?.role,
        },
      );

      return res.status(200).json(
        successResponse({
          data: reservation,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  expireStaleReservations = async (req, res, next) => {
    try {
      const result = await this.reservationService.expireStaleReservations({
        limit: req.body?.limit ? parseInt(req.body.limit, 10) : 100,
      });

      return res.status(200).json(
        successResponse({
          data: result,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const reservationController = new ReservationController();
