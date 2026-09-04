import { successResponse, UnauthorizedError } from '@ecommerce/shared';

import { returnPickupService as defaultReturnService } from '../services/return-pickup.service.js';

export class ReturnPickupController {
  constructor(returnService = defaultReturnService) {
    this.returnService = returnService;
  }

  requestReturn = async (req, res, next) => {
    try {
      const returnPickup = await this.returnService.requestReturnPickup({
        orderId: req.body.orderId || req.body.order_id,
        userId: req.body.userId || req.body.user_id || req.user?.id,
        warehouseId: req.body.warehouseId || req.body.warehouse_id,
        pickupAddress: req.body.pickupAddress || req.body.pickup_address,
        items: req.body.items,
        courierCode: req.body.courierCode || req.body.courier_code,
      });

      return res.status(201).json(
        successResponse({
          data: returnPickup,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  schedulePickup = async (req, res, next) => {
    try {
      const returnPickup = await this.returnService.schedulePickup(req.params.id, {
        courierCode: req.body.courierCode || req.body.courier_code,
        returnTrackingNumber: req.body.returnTrackingNumber || req.body.return_tracking_number,
        scheduledDate: req.body.scheduledDate || req.body.scheduled_date,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: returnPickup,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  recordProofOfPickup = async (req, res, next) => {
    try {
      const returnPickup = await this.returnService.recordProofOfPickup(req.params.id, {
        signature: req.body.signature,
        receivedBy: req.body.receivedBy || req.body.received_by,
        location: req.body.location,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: returnPickup,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  updateTrackingCheckpoint = async (req, res, next) => {
    try {
      const returnPickup = await this.returnService.updateTrackingCheckpoint(req.params.id, {
        status: req.body.status,
        location: req.body.location,
        description: req.body.description,
        recordedBy: req.user?.id,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: returnPickup,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  receiveAtWarehouse = async (req, res, next) => {
    try {
      const returnPickup = await this.returnService.receiveAtWarehouse(req.params.id, {
        location: req.body.location,
        notes: req.body.notes,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: returnPickup,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  inspectAndRestock = async (req, res, next) => {
    try {
      const returnPickup = await this.returnService.inspectAndRestock(req.params.id, {
        inspections: req.body.inspections,
        inspectionNotes: req.body.inspectionNotes || req.body.inspection_notes,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: returnPickup,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getTrackingTimeline = async (req, res, next) => {
    try {
      const trackingNumber = req.params.trackingNumber || req.params.tracking_number;
      const timeline = await this.returnService.getTrackingTimeline(trackingNumber);

      return res.status(200).json(
        successResponse({
          data: timeline,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getReturnById = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      if (!userId) {
        throw new UnauthorizedError('Authentication required to view return details');
      }

      const returnPickup = await this.returnService.getReturnById(req.params.id, {
        userId,
        userRole: req.user?.role,
        authSellerId: req.user?.sellerId || req.user?.id,
      });

      return res.status(200).json(
        successResponse({
          data: returnPickup,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  listReturns = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      if (!userId) {
        throw new UnauthorizedError('Authentication required to list returns');
      }

      const { returns, pagination } = await this.returnService.listReturns(req.query, {
        userId,
        userRole: req.user?.role,
        authSellerId: req.user?.sellerId || req.user?.id,
      });

      return res.status(200).json(
        successResponse({
          data: returns,
          meta: { pagination, requestId: req.id },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/returns/admin/summary
   * Aggregates return requests and status counts
   */
  getAdminSummary = async (req, res, next) => {
    try {
      const { prisma } = await import('../lib/prisma.js');
      const [totalReturns, statusCounts, pendingCount, completedCount, rejectedCount] =
        await Promise.all([
          prisma.returnRequest.count(),
          prisma.returnRequest.groupBy({
            by: ['status'],
            _count: { id: true },
          }),
          prisma.returnRequest.count({
            where: {
              status: { in: ['REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED'] },
            },
          }),
          prisma.returnRequest.count({ where: { status: 'COMPLETED' } }),
          prisma.returnRequest.count({ where: { status: 'REJECTED' } }),
        ]);

      const returnsByStatus = {};
      for (const s of statusCounts) {
        returnsByStatus[s.status] = s._count.id;
      }

      return res.status(200).json(
        successResponse({
          data: {
            totalReturns,
            pendingCount,
            completedCount,
            rejectedCount,
            returnsByStatus,
          },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const returnPickupController = new ReturnPickupController();
