import { successResponse, UnauthorizedError } from '@ecommerce/shared';

import { shipmentService as defaultShipmentService } from '../services/shipment.service.js';

export class ShipmentController {
  constructor(shipmentService = defaultShipmentService) {
    this.shipmentService = shipmentService;
  }

  allocateShipments = async (req, res, next) => {
    try {
      const shipments = await this.shipmentService.allocateAndCreateShipment({
        orderId: req.body.orderId || req.body.order_id,
        userId: req.body.userId || req.body.user_id || req.user?.id,
        reservationId: req.body.reservationId || req.body.reservation_id,
        reservationKey: req.body.reservationKey || req.body.reservation_key,
        shippingAddress: req.body.shippingAddress || req.body.shipping_address,
        items: req.body.items,
        courierCode: req.body.courierCode || req.body.courier_code,
      });

      return res.status(201).json(
        successResponse({
          data: shipments,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  packShipment = async (req, res, next) => {
    try {
      const shipment = await this.shipmentService.packShipment(req.params.id, {
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: shipment,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  dispatchShipment = async (req, res, next) => {
    try {
      const shipment = await this.shipmentService.dispatchShipment(req.params.id, {
        courierCode: req.body.courierCode || req.body.courier_code,
        trackingNumber: req.body.trackingNumber || req.body.tracking_number,
        manifestId: req.body.manifestId || req.body.manifest_id,
        labelUrl: req.body.labelUrl || req.body.label_url,
        estimatedDelivery: req.body.estimatedDelivery || req.body.estimated_delivery,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: shipment,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  updateTrackingCheckpoint = async (req, res, next) => {
    try {
      const shipment = await this.shipmentService.updateTrackingCheckpoint(req.params.id, {
        status: req.body.status,
        location: req.body.location,
        description: req.body.description,
        recordedBy: req.user?.id,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: shipment,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  completeDelivery = async (req, res, next) => {
    try {
      const shipment = await this.shipmentService.completeDelivery(req.params.id, {
        recipientName: req.body.recipientName || req.body.recipient_name,
        signature: req.body.signature,
        deliveryNotes: req.body.deliveryNotes || req.body.delivery_notes,
        userRole: req.user?.role,
      });

      return res.status(200).json(
        successResponse({
          data: shipment,
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
      const timeline = await this.shipmentService.getTrackingTimeline(trackingNumber);

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

  getShipmentById = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      if (!userId) {
        throw new UnauthorizedError('Authentication required to view shipment');
      }

      const shipment = await this.shipmentService.getShipmentById(req.params.id, {
        userId,
        userRole: req.user?.role,
        authSellerId: req.user?.sellerId || req.user?.id,
      });

      return res.status(200).json(
        successResponse({
          data: shipment,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  listShipments = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.headers['x-user-id'];
      if (!userId) {
        throw new UnauthorizedError('Authentication required to list shipments');
      }

      const { shipments, pagination } = await this.shipmentService.listShipments(req.query, {
        userId,
        userRole: req.user?.role,
        authSellerId: req.user?.sellerId || req.user?.id,
      });

      return res.status(200).json(
        successResponse({
          data: shipments,
          meta: { pagination, requestId: req.id },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const shipmentController = new ShipmentController();
