import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BusinessRuleError,
  EventTypes,
  buildPaginationMeta,
} from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';
import { shipmentRepository as defaultShipmentRepo } from '../repositories/shipment.repository.js';
import { reservationRepository as defaultReservationRepo } from '../repositories/reservation.repository.js';
import { warehouseRepository as defaultWarehouseRepo } from '../repositories/warehouse.repository.js';
import { fulfillmentOutboxRepository as defaultOutboxRepo } from '../repositories/outbox.repository.js';

const VALID_COURIER_CODES = ['DELHIVERY', 'BLUEDART', 'SHIPROCKET', 'EKART', 'INTERNAL_FLEET'];

const ALLOWED_TRANSITIONS = Object.freeze({
  ALLOCATED: ['PACKED', 'DISPATCHED', 'CANCELLED'],
  PACKED: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'RETURNED_TO_ORIGIN'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'RETURNED_TO_ORIGIN'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED_DELIVERY', 'RETURNED_TO_ORIGIN'],
  FAILED_DELIVERY: ['OUT_FOR_DELIVERY', 'RETURNED_TO_ORIGIN'],
  RETURNED_TO_ORIGIN: [], // Terminal
  DELIVERED: [], // Terminal
  CANCELLED: [], // Terminal
});

export class ShipmentService {
  constructor({
    prismaClient = defaultPrisma,
    shipmentRepo = defaultShipmentRepo,
    reservationRepo = defaultReservationRepo,
    warehouseRepo = defaultWarehouseRepo,
    outboxRepo = defaultOutboxRepo,
  } = {}) {
    this.prisma = prismaClient;
    this.shipmentRepo = shipmentRepo;
    this.reservationRepo = reservationRepo;
    this.warehouseRepo = warehouseRepo;
    this.outboxRepo = outboxRepo;
  }

  /**
   * Generates a standardized, unique shipment number (e.g., SHP-20260825-ABC123)
   */
  _generateShipmentNumber() {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SHP-${dateStr}-${randStr}`;
  }

  /**
   * Generates a unique tracking number
   */
  _generateTrackingNumber(courierCode = 'INTERNAL_FLEET') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TRK-${courierCode}-${timestamp}-${randStr}`;
  }

  /**
   * Validates state transitions
   */
  _validateTransition(currentStatus, targetStatus) {
    if (currentStatus === targetStatus) {
      return; // No-op idempotent transition
    }

    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BusinessRuleError(
        `Invalid status transition from '${currentStatus}' to '${targetStatus}'`,
        { currentStatus, targetStatus, allowedTransitions: allowed },
      );
    }
  }

  /**
   * Multi-Warehouse Allocation & Shipment Creation
   */
  async allocateAndCreateShipment({
    orderId,
    userId,
    reservationId,
    reservationKey,
    shippingAddress,
    items = [],
    courierCode = 'INTERNAL_FLEET',
  }) {
    if (!orderId || typeof orderId !== 'string') {
      throw new ValidationError('Order ID is required and must be a valid UUID');
    }
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('User ID is required and must be a valid UUID');
    }
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      throw new ValidationError('Shipping address object is required');
    }

    const cleanCourier = String(courierCode).toUpperCase();
    if (!VALID_COURIER_CODES.includes(cleanCourier)) {
      throw new ValidationError(
        `Invalid courier code '${courierCode}'. Allowed: ${VALID_COURIER_CODES.join(', ')}`,
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. If reservation ID or key provided, verify and use reservation context
      let reservation = null;
      if (reservationId) {
        reservation = await this.reservationRepo.findById(reservationId, tx);
      } else if (reservationKey) {
        reservation = await this.reservationRepo.findByReservationKey(reservationKey, tx);
      }

      if (reservationId && !reservation) {
        throw new NotFoundError(`Reservation with ID '${reservationId}' not found`);
      }

      // Check if shipments already allocated for this reservation/order to prevent double allocation
      if (reservation) {
        const existingShipments = await this.shipmentRepo.findByReservationId(reservation.id, tx);
        if (existingShipments && existingShipments.length > 0) {
          throw new ConflictError(
            `Shipment(s) already allocated for reservation '${reservation.id}'`,
          );
        }
      }

      // 2. Group items by warehouse
      const warehouseGroups = new Map();

      if (reservation && reservation.items && reservation.items.length > 0) {
        for (const resItem of reservation.items) {
          const invItem = resItem.inventory_item;
          const warehouseId = invItem?.warehouse_id || resItem.warehouse_id;

          if (!warehouseId) {
            throw new BusinessRuleError(
              `Cannot allocate item '${resItem.sku}': Warehouse ID missing from reservation`,
            );
          }

          if (!warehouseGroups.has(warehouseId)) {
            warehouseGroups.set(warehouseId, []);
          }

          // Match unit price from input if provided
          const matchedInputItem = items.find(
            (i) => i.sku === resItem.sku || i.productId === resItem.product_id,
          );

          warehouseGroups.get(warehouseId).push({
            product_id: resItem.product_id,
            sku: resItem.sku,
            seller_id: invItem?.seller_id || matchedInputItem?.sellerId || null,
            quantity: resItem.quantity,
            unit_price: matchedInputItem?.unitPrice || null,
          });
        }
      } else if (items && items.length > 0) {
        // Direct item allocation
        for (const item of items) {
          if (!item.warehouseId) {
            throw new ValidationError(`Warehouse ID is required for item '${item.sku}'`);
          }
          if (!warehouseGroups.has(item.warehouseId)) {
            warehouseGroups.set(item.warehouseId, []);
          }
          warehouseGroups.get(item.warehouseId).push({
            product_id: item.productId,
            sku: item.sku,
            seller_id: item.sellerId || null,
            quantity: item.quantity,
            unit_price: item.unitPrice || null,
          });
        }
      } else {
        throw new ValidationError('No items provided for shipment allocation');
      }

      const createdShipments = [];

      // 3. Create one shipment per warehouse group
      for (const [warehouseId, groupItems] of warehouseGroups.entries()) {
        const warehouse = await this.warehouseRepo.findById(warehouseId, tx);
        if (!warehouse) {
          throw new NotFoundError(`Warehouse with ID '${warehouseId}' not found for allocation`);
        }

        const shipmentNumber = this._generateShipmentNumber();
        const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // +4 days estimate

        const shipment = await this.shipmentRepo.createShipmentWithItems(
          {
            shipment_number: shipmentNumber,
            order_id: orderId,
            user_id: userId,
            warehouse_id: warehouseId,
            reservation_id: reservation ? reservation.id : null,
            status: 'ALLOCATED',
            courier_code: cleanCourier,
            shipping_address: shippingAddress,
            estimated_delivery: estimatedDelivery,
            items: groupItems,
            initial_tracking_description: `Shipment allocated to warehouse ${warehouse.code} (${warehouse.name})`,
          },
          tx,
        );

        createdShipments.push(shipment);

        // Emit fulfillment.allocated event
        await this.outboxRepo.createEvent(
          {
            eventType: EventTypes.FULFILLMENT_ALLOCATED,
            aggregateType: 'Shipment',
            aggregateId: shipment.id,
            payload: {
              shipmentId: shipment.id,
              shipmentNumber: shipment.shipment_number,
              orderId: shipment.order_id,
              userId: shipment.user_id,
              warehouseId: shipment.warehouse_id,
              warehouseCode: warehouse.code,
              status: shipment.status,
              items: shipment.items.map((i) => ({
                productId: i.product_id,
                sku: i.sku,
                sellerId: i.seller_id,
                quantity: i.quantity,
              })),
            },
          },
          tx,
        );

        // Emit shipment.created event
        await this.outboxRepo.createEvent(
          {
            eventType: EventTypes.SHIPMENT_CREATED,
            aggregateType: 'Shipment',
            aggregateId: shipment.id,
            payload: {
              shipmentId: shipment.id,
              shipmentNumber: shipment.shipment_number,
              orderId: shipment.order_id,
              userId: shipment.user_id,
              warehouseId: shipment.warehouse_id,
              courierCode: shipment.courier_code,
              status: shipment.status,
              estimatedDelivery: shipment.estimated_delivery.toISOString(),
            },
          },
          tx,
        );
      }

      return createdShipments;
    });
  }

  /**
   * Packs a shipment (ALLOCATED -> PACKED)
   */
  async packShipment(id, { userRole: _userRole } = {}) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid shipment ID is required');
    }

    const shipment = await this.shipmentRepo.findById(id);
    if (!shipment) {
      throw new NotFoundError(`Shipment with ID '${id}' not found`);
    }

    this._validateTransition(shipment.status, 'PACKED');

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.shipmentRepo.updateShipmentStatus(id, { status: 'PACKED' }, tx);

      await this.shipmentRepo.addTrackingUpdate(
        {
          shipment_id: id,
          status: 'PACKED',
          description: 'Shipment items packed and ready for courier pickup',
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Dispatches a shipment with courier assignment (PACKED/ALLOCATED -> DISPATCHED)
   */
  async dispatchShipment(
    id,
    {
      courierCode,
      trackingNumber,
      manifestId,
      labelUrl,
      estimatedDelivery,
      userRole: _userRole,
    } = {},
  ) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid shipment ID is required');
    }

    const shipment = await this.shipmentRepo.findById(id);
    if (!shipment) {
      throw new NotFoundError(`Shipment with ID '${id}' not found`);
    }

    // Enforce state transition
    this._validateTransition(shipment.status, 'DISPATCHED');

    const effectiveCourier = courierCode
      ? String(courierCode).toUpperCase()
      : shipment.courier_code || 'INTERNAL_FLEET';

    if (!VALID_COURIER_CODES.includes(effectiveCourier)) {
      throw new ValidationError(
        `Invalid courier code '${courierCode}'. Allowed: ${VALID_COURIER_CODES.join(', ')}`,
      );
    }

    const generatedTracking = trackingNumber || this._generateTrackingNumber(effectiveCourier);
    const generatedManifest = manifestId || `MAN-${Date.now().toString(36).toUpperCase()}`;
    const generatedLabelUrl = labelUrl || `/api/v1/fulfillment/shipments/${id}/label`;
    const dispatchedAt = new Date();

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.shipmentRepo.updateShipmentStatus(
        id,
        {
          status: 'DISPATCHED',
          courier_code: effectiveCourier,
          tracking_number: generatedTracking,
          manifest_id: generatedManifest,
          label_url: generatedLabelUrl,
          dispatched_at: dispatchedAt,
          ...(estimatedDelivery ? { estimated_delivery: new Date(estimatedDelivery) } : {}),
        },
        tx,
      );

      await this.shipmentRepo.addTrackingUpdate(
        {
          shipment_id: id,
          status: 'DISPATCHED',
          location: shipment.warehouse?.city || 'Warehouse Origin Hub',
          description: `Shipment handed over to ${effectiveCourier}. Tracking #: ${generatedTracking}`,
          recorded_at: dispatchedAt,
        },
        tx,
      );

      // Emit shipment.shipped outbox event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.SHIPMENT_SHIPPED,
          aggregateType: 'Shipment',
          aggregateId: updated.id,
          payload: {
            shipmentId: updated.id,
            shipmentNumber: updated.shipment_number,
            orderId: updated.order_id,
            userId: updated.user_id,
            courierCode: updated.courier_code,
            trackingNumber: updated.tracking_number,
            manifestId: updated.manifest_id,
            labelUrl: updated.label_url,
            dispatchedAt: updated.dispatched_at.toISOString(),
            status: updated.status,
          },
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Records a tracking checkpoint and progresses state machine
   */
  async updateTrackingCheckpoint(
    id,
    { status, location, description, recordedBy = null, userRole: _userRole } = {},
  ) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid shipment ID is required');
    }
    if (!status) {
      throw new ValidationError('Target tracking status is required');
    }
    if (!description || typeof description !== 'string') {
      throw new ValidationError('Checkpoint description is required');
    }

    const cleanStatus = String(status).toUpperCase();
    const shipment = await this.shipmentRepo.findById(id);
    if (!shipment) {
      throw new NotFoundError(`Shipment with ID '${id}' not found`);
    }

    this._validateTransition(shipment.status, cleanStatus);

    return await this.prisma.$transaction(async (tx) => {
      const updateData = { status: cleanStatus };
      if (cleanStatus === 'DELIVERED') {
        updateData.delivered_at = new Date();
      }

      const updated = await this.shipmentRepo.updateShipmentStatus(id, updateData, tx);

      await this.shipmentRepo.addTrackingUpdate(
        {
          shipment_id: id,
          status: cleanStatus,
          location: location ? String(location).trim() : null,
          description: description.trim(),
          recorded_by: recordedBy,
        },
        tx,
      );

      if (cleanStatus === 'DELIVERED') {
        await this.outboxRepo.createEvent(
          {
            eventType: EventTypes.SHIPMENT_DELIVERED,
            aggregateType: 'Shipment',
            aggregateId: updated.id,
            payload: {
              shipmentId: updated.id,
              shipmentNumber: updated.shipment_number,
              orderId: updated.order_id,
              userId: updated.user_id,
              trackingNumber: updated.tracking_number,
              deliveredAt: (updated.delivered_at || new Date()).toISOString(),
              status: updated.status,
            },
          },
          tx,
        );
      }

      return updated;
    });
  }

  /**
   * Completes delivery with Proof of Delivery (POD) metadata
   */
  async completeDelivery(
    id,
    { recipientName, signature, deliveryNotes, userRole: _userRole } = {},
  ) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid shipment ID is required');
    }
    if (!recipientName || typeof recipientName !== 'string' || !recipientName.trim()) {
      throw new ValidationError('Recipient name is required for Proof of Delivery (POD)');
    }

    const shipment = await this.shipmentRepo.findById(id);
    if (!shipment) {
      throw new NotFoundError(`Shipment with ID '${id}' not found`);
    }

    if (shipment.status === 'DELIVERED') {
      return shipment; // Idempotent delivery completion
    }

    this._validateTransition(shipment.status, 'DELIVERED');

    const deliveredAt = new Date();
    const cleanRecipient = recipientName.trim();
    const cleanSignature = signature ? String(signature).trim() : 'POD-SIG-VERIFIED';

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.shipmentRepo.updateShipmentStatus(
        id,
        {
          status: 'DELIVERED',
          delivered_at: deliveredAt,
          pod_received_by: cleanRecipient,
          pod_signature: cleanSignature,
          pod_received_at: deliveredAt,
          delivery_notes: deliveryNotes ? String(deliveryNotes).trim() : null,
        },
        tx,
      );

      await this.shipmentRepo.addTrackingUpdate(
        {
          shipment_id: id,
          status: 'DELIVERED',
          location: shipment.shipping_address?.city || 'Customer Address',
          description: `Delivered to recipient: ${cleanRecipient}`,
          recorded_at: deliveredAt,
        },
        tx,
      );

      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.SHIPMENT_DELIVERED,
          aggregateType: 'Shipment',
          aggregateId: updated.id,
          payload: {
            shipmentId: updated.id,
            shipmentNumber: updated.shipment_number,
            orderId: updated.order_id,
            userId: updated.user_id,
            trackingNumber: updated.tracking_number,
            deliveredAt: updated.delivered_at.toISOString(),
            podReceivedBy: updated.pod_received_by,
            podSignature: updated.pod_signature,
            status: updated.status,
          },
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Retrieves live tracking timeline by tracking number (sanitized for public/customer access)
   */
  async getTrackingTimeline(trackingNumber) {
    if (!trackingNumber || typeof trackingNumber !== 'string') {
      throw new ValidationError('Valid tracking number is required');
    }

    const shipment = await this.shipmentRepo.findByTrackingNumber(trackingNumber.trim());
    if (!shipment) {
      throw new NotFoundError(`Shipment with tracking number '${trackingNumber}' not found`);
    }

    return {
      shipmentNumber: shipment.shipment_number,
      trackingNumber: shipment.tracking_number,
      courierCode: shipment.courier_code,
      status: shipment.status,
      estimatedDelivery: shipment.estimated_delivery,
      dispatchedAt: shipment.dispatched_at,
      deliveredAt: shipment.delivered_at,
      trackingUpdates: (shipment.tracking_updates || []).map((u) => ({
        status: u.status,
        location: u.location,
        description: u.description,
        recordedAt: u.recorded_at,
      })),
    };
  }

  /**
   * Retrieves full shipment details with strict IDOR protection
   */
  async getShipmentById(id, { userId, userRole, authSellerId } = {}) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid shipment ID is required');
    }

    const shipment = await this.shipmentRepo.findById(id);
    if (!shipment) {
      throw new NotFoundError(`Shipment with ID '${id}' not found`);
    }

    if (userRole === 'CUSTOMER' && shipment.user_id !== userId) {
      throw new ForbiddenError('Access denied: Cannot view shipment belonging to another user');
    }

    if (userRole === 'SELLER') {
      const hasSellerItem = (shipment.items || []).some(
        (i) => i.seller_id && authSellerId && i.seller_id === authSellerId,
      );
      if (!hasSellerItem) {
        throw new ForbiddenError(
          'Access denied: Shipment does not contain products from your seller account',
        );
      }
    }

    return shipment;
  }

  /**
   * Lists shipments with RBAC scoping and pagination
   */
  async listShipments(
    { status, courierCode, orderId, fromDate, toDate, page = 1, limit = 20 } = {},
    { userId, userRole, authSellerId } = {},
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = {
      status,
      courier_code: courierCode ? String(courierCode).toUpperCase() : undefined,
      order_id: orderId,
      from_date: fromDate,
      to_date: toDate,
      skip,
      take: limitNum,
    };

    if (userRole === 'CUSTOMER') {
      query.user_id = userId;
    } else if (userRole === 'SELLER') {
      query.seller_id = authSellerId || userId;
    }

    const { items, total } = await this.shipmentRepo.findMany(query);

    return {
      shipments: items,
      pagination: buildPaginationMeta({ page: pageNum, limit: limitNum, total }),
    };
  }
}

export const shipmentService = new ShipmentService();
