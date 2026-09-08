import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  BusinessRuleError,
  EventTypes,
  buildPaginationMeta,
} from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';
import { returnPickupRepository as defaultReturnRepo } from '../repositories/return-pickup.repository.js';
import { inventoryRepository as defaultInventoryRepo } from '../repositories/inventory.repository.js';
import { warehouseRepository as defaultWarehouseRepo } from '../repositories/warehouse.repository.js';
import { fulfillmentOutboxRepository as defaultOutboxRepo } from '../repositories/outbox.repository.js';

const VALID_COURIER_CODES = ['DELHIVERY', 'BLUEDART', 'SHIPROCKET', 'EKART', 'INTERNAL_FLEET'];

const VALID_INSPECTION_GRADES = [
  'PASS',
  'DAMAGED',
  'DEFECTIVE',
  'WRONG_ITEM',
  'MISSING_ACCESSORIES',
];

const ALLOWED_RETURN_TRANSITIONS = Object.freeze({
  REQUESTED: ['PICKUP_SCHEDULED', 'CANCELLED'],
  PICKUP_SCHEDULED: ['OUT_FOR_PICKUP', 'PICKED_UP', 'CANCELLED'],
  OUT_FOR_PICKUP: ['PICKED_UP', 'PICKUP_SCHEDULED', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'RECEIVED_AT_WAREHOUSE'],
  IN_TRANSIT: ['RECEIVED_AT_WAREHOUSE'],
  RECEIVED_AT_WAREHOUSE: ['INSPECTED', 'COMPLETED', 'REJECTED'],
  INSPECTED: ['COMPLETED', 'REJECTED'],
  COMPLETED: [], // Terminal
  REJECTED: [], // Terminal
  CANCELLED: [], // Terminal
});

export class ReturnPickupService {
  constructor({
    prismaClient = defaultPrisma,
    returnRepo = defaultReturnRepo,
    inventoryRepo = defaultInventoryRepo,
    warehouseRepo = defaultWarehouseRepo,
    outboxRepo = defaultOutboxRepo,
  } = {}) {
    this.prisma = prismaClient;
    this.returnRepo = returnRepo;
    this.inventoryRepo = inventoryRepo;
    this.warehouseRepo = warehouseRepo;
    this.outboxRepo = outboxRepo;
  }

  /**
   * Generates a standardized return number (e.g., RET-20260825-ABC123)
   */
  _generateReturnNumber() {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RET-${dateStr}-${randStr}`;
  }

  /**
   * Generates a unique reverse logistics tracking number
   */
  _generateReturnTrackingNumber(courierCode = 'INTERNAL_FLEET') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RET-TRK-${courierCode}-${timestamp}-${randStr}`;
  }

  /**
   * Validates state machine transitions
   */
  _validateTransition(currentStatus, targetStatus) {
    if (currentStatus === targetStatus) {
      return; // Idempotent no-op
    }

    const allowed = ALLOWED_RETURN_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BusinessRuleError(
        `Invalid return status transition from '${currentStatus}' to '${targetStatus}'`,
        { currentStatus, targetStatus, allowedTransitions: allowed },
      );
    }
  }

  /**
   * Initiates a return pickup request
   */
  async requestReturnPickup({
    orderId,
    userId,
    warehouseId,
    pickupAddress,
    items = [],
    courierCode = 'INTERNAL_FLEET',
  }) {
    if (!orderId || typeof orderId !== 'string') {
      throw new ValidationError('Order ID is required and must be a valid UUID');
    }
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('User ID is required and must be a valid UUID');
    }
    if (!pickupAddress || typeof pickupAddress !== 'object') {
      throw new ValidationError('Pickup address object is required');
    }
    if (!items || items.length === 0) {
      throw new ValidationError('At least one return item must be provided');
    }

    const cleanCourier = String(courierCode).toUpperCase();
    if (!VALID_COURIER_CODES.includes(cleanCourier)) {
      throw new ValidationError(
        `Invalid courier code '${courierCode}'. Allowed: ${VALID_COURIER_CODES.join(', ')}`,
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      // Find destination warehouse
      let destinationWarehouseId = warehouseId;
      if (!destinationWarehouseId) {
        const warehouses = await this.warehouseRepo.findMany({ is_active: true, take: 1 }, tx);
        if (!warehouses || warehouses.length === 0) {
          throw new NotFoundError('No active warehouse available for return destination');
        }
        destinationWarehouseId = warehouses[0].id;
      } else {
        const wh = await this.warehouseRepo.findById(destinationWarehouseId, tx);
        if (!wh) {
          throw new NotFoundError(`Warehouse with ID '${destinationWarehouseId}' not found`);
        }
      }

      const returnNumber = this._generateReturnNumber();

      const returnPickup = await this.returnRepo.createReturnPickup(
        {
          return_number: returnNumber,
          order_id: orderId,
          user_id: userId,
          warehouse_id: destinationWarehouseId,
          status: 'REQUESTED',
          courier_code: cleanCourier,
          pickup_address: pickupAddress,
          items: items.map((i) => ({
            product_id: i.productId || i.product_id,
            sku: i.sku,
            seller_id: i.sellerId || i.seller_id || null,
            quantity: i.quantity,
            reason: i.reason || 'Customer Return',
          })),
        },
        tx,
      );

      // Emit return.requested event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.RETURN_REQUESTED,
          aggregateType: 'ReturnPickup',
          aggregateId: returnPickup.id,
          payload: {
            returnId: returnPickup.id,
            returnNumber: returnPickup.return_number,
            orderId: returnPickup.order_id,
            userId: returnPickup.user_id,
            warehouseId: returnPickup.warehouse_id,
            status: returnPickup.status,
            items: returnPickup.items.map((it) => ({
              productId: it.product_id,
              sku: it.sku,
              sellerId: it.seller_id,
              quantity: it.quantity,
              reason: it.reason,
            })),
          },
        },
        tx,
      );

      return returnPickup;
    });
  }

  /**
   * Schedules reverse logistics courier pickup
   */
  async schedulePickup(
    id,
    { courierCode, returnTrackingNumber, scheduledDate, userRole: _userRole } = {},
  ) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid return pickup ID is required');
    }

    const returnPickup = await this.returnRepo.findById(id);
    if (!returnPickup) {
      throw new NotFoundError(`Return pickup with ID '${id}' not found`);
    }

    this._validateTransition(returnPickup.status, 'PICKUP_SCHEDULED');

    const effectiveCourier = courierCode
      ? String(courierCode).toUpperCase()
      : returnPickup.courier_code || 'INTERNAL_FLEET';

    if (!VALID_COURIER_CODES.includes(effectiveCourier)) {
      throw new ValidationError(
        `Invalid courier code '${courierCode}'. Allowed: ${VALID_COURIER_CODES.join(', ')}`,
      );
    }

    const generatedTracking =
      returnTrackingNumber || this._generateReturnTrackingNumber(effectiveCourier);
    const scheduledPickupDate = scheduledDate
      ? new Date(scheduledDate)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.returnRepo.updateReturnStatus(
        id,
        {
          status: 'PICKUP_SCHEDULED',
          courier_code: effectiveCourier,
          return_tracking_number: generatedTracking,
          scheduled_pickup_date: scheduledPickupDate,
        },
        tx,
      );

      await this.returnRepo.addTrackingUpdate(
        {
          return_pickup_id: id,
          status: 'PICKUP_SCHEDULED',
          description: `Reverse logistics scheduled with ${effectiveCourier}. Tracking #: ${generatedTracking}`,
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Records Proof of Pickup (POP) from customer
   */
  async recordProofOfPickup(id, { signature, receivedBy, location, userRole: _userRole } = {}) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid return pickup ID is required');
    }

    const returnPickup = await this.returnRepo.findById(id);
    if (!returnPickup) {
      throw new NotFoundError(`Return pickup with ID '${id}' not found`);
    }

    this._validateTransition(returnPickup.status, 'PICKED_UP');

    const pickedUpAt = new Date();
    const cleanSignature = signature ? String(signature).trim() : 'POP-VERIFIED';
    const cleanReceivedBy = receivedBy ? String(receivedBy).trim() : 'Courier Agent';

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.returnRepo.updateReturnStatus(
        id,
        {
          status: 'PICKED_UP',
          picked_up_at: pickedUpAt,
          pop_signature: cleanSignature,
          pop_received_by: cleanReceivedBy,
        },
        tx,
      );

      await this.returnRepo.addTrackingUpdate(
        {
          return_pickup_id: id,
          status: 'PICKED_UP',
          location: location || returnPickup.pickup_address?.city || 'Customer Origin',
          description: `Item successfully collected by ${cleanReceivedBy}`,
          recorded_at: pickedUpAt,
        },
        tx,
      );

      // Emit return.pickedUp outbox event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.RETURN_PICKED_UP,
          aggregateType: 'ReturnPickup',
          aggregateId: updated.id,
          payload: {
            returnId: updated.id,
            returnNumber: updated.return_number,
            orderId: updated.order_id,
            userId: updated.user_id,
            trackingNumber: updated.return_tracking_number,
            pickedUpAt: (updated.picked_up_at || pickedUpAt).toISOString(),
            status: updated.status,
          },
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Records intermediate tracking checkpoint
   */
  async updateTrackingCheckpoint(
    id,
    { status, location, description, recordedBy = null, userRole: _userRole } = {},
  ) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid return pickup ID is required');
    }
    if (!status) {
      throw new ValidationError('Target return status is required');
    }
    if (!description || typeof description !== 'string') {
      throw new ValidationError('Tracking description is required');
    }

    const cleanStatus = String(status).toUpperCase();
    const returnPickup = await this.returnRepo.findById(id);
    if (!returnPickup) {
      throw new NotFoundError(`Return pickup with ID '${id}' not found`);
    }

    this._validateTransition(returnPickup.status, cleanStatus);

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.returnRepo.updateReturnStatus(id, { status: cleanStatus }, tx);

      await this.returnRepo.addTrackingUpdate(
        {
          return_pickup_id: id,
          status: cleanStatus,
          location: location ? String(location).trim() : null,
          description: description.trim(),
          recorded_by: recordedBy,
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Records package received at destination warehouse hub
   */
  async receiveAtWarehouse(id, { location, notes: _notes, userRole: _userRole } = {}) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid return pickup ID is required');
    }

    const returnPickup = await this.returnRepo.findById(id);
    if (!returnPickup) {
      throw new NotFoundError(`Return pickup with ID '${id}' not found`);
    }

    this._validateTransition(returnPickup.status, 'RECEIVED_AT_WAREHOUSE');

    const receivedAt = new Date();

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.returnRepo.updateReturnStatus(
        id,
        {
          status: 'RECEIVED_AT_WAREHOUSE',
          received_at: receivedAt,
        },
        tx,
      );

      await this.returnRepo.addTrackingUpdate(
        {
          return_pickup_id: id,
          status: 'RECEIVED_AT_WAREHOUSE',
          location: location || returnPickup.warehouse?.city || 'Warehouse Intake Facility',
          description: 'Return package received at destination warehouse facility',
          recorded_at: receivedAt,
        },
        tx,
      );

      // Emit return.received outbox event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.RETURN_RECEIVED,
          aggregateType: 'ReturnPickup',
          aggregateId: updated.id,
          payload: {
            returnId: updated.id,
            returnNumber: updated.return_number,
            orderId: updated.order_id,
            userId: updated.user_id,
            warehouseId: updated.warehouse_id,
            receivedAt: (updated.received_at || receivedAt).toISOString(),
            status: updated.status,
          },
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Quality Inspection (QC) & Automated Inventory Restocking for PASS items
   */
  async inspectAndRestock(id, { inspections = [], inspectionNotes, userRole: _userRole } = {}) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid return pickup ID is required');
    }

    const returnPickup = await this.returnRepo.findById(id);
    if (!returnPickup) {
      throw new NotFoundError(`Return pickup with ID '${id}' not found`);
    }

    if (returnPickup.status === 'COMPLETED' || returnPickup.status === 'REJECTED') {
      throw new BusinessRuleError(
        `Cannot inspect return pickup: Already finalized with status '${returnPickup.status}'`,
      );
    }

    this._validateTransition(returnPickup.status, 'COMPLETED');

    const completedAt = new Date();
    let hasAnyPass = false;

    return await this.prisma.$transaction(async (tx) => {
      // 1. Process inspection and restock for each item
      for (const item of returnPickup.items || []) {
        if (item.is_restocked) {
          continue; // Prevent double restocking
        }

        const inspectionData = inspections.find(
          (i) => i.itemId === item.id || i.sku === item.sku || i.productId === item.product_id,
        ) || { grade: 'PASS' };

        const cleanGrade = String(inspectionData.grade || 'PASS').toUpperCase();
        if (!VALID_INSPECTION_GRADES.includes(cleanGrade)) {
          throw new ValidationError(
            `Invalid inspection grade '${inspectionData.grade}'. Allowed: ${VALID_INSPECTION_GRADES.join(', ')}`,
          );
        }

        const shouldRestock = cleanGrade === 'PASS';
        if (shouldRestock) {
          hasAnyPass = true;
          // Atomically restock inventory in destination warehouse
          const invItem = await this.inventoryRepo.findByWarehouseAndSku(
            returnPickup.warehouse_id,
            item.sku,
            tx,
          );

          if (invItem) {
            await this.inventoryRepo.adjustStock(
              invItem.id,
              {
                quantityOnHandDelta: item.quantity,
                reason: `Return Restock (${returnPickup.return_number})`,
              },
              tx,
            );
          } else {
            // If item did not exist in target warehouse, upsert stock
            await this.inventoryRepo.upsertStock(
              {
                productId: item.product_id,
                sku: item.sku,
                sellerId: item.seller_id,
                warehouseId: returnPickup.warehouse_id,
                quantityOnHand: item.quantity,
              },
              tx,
            );
          }

          // Emit inventory.adjusted event
          await this.outboxRepo.createEvent(
            {
              eventType: EventTypes.INVENTORY_LOW_STOCK
                ? 'inventory.adjusted'
                : 'inventory.adjusted',
              aggregateType: 'Inventory',
              aggregateId: invItem ? invItem.id : returnPickup.warehouse_id,
              payload: {
                productId: item.product_id,
                sku: item.sku,
                warehouseId: returnPickup.warehouse_id,
                quantityRestocked: item.quantity,
                returnNumber: returnPickup.return_number,
              },
            },
            tx,
          );
        }

        // Update item inspection metadata
        await this.returnRepo.updateItemInspection(
          item.id,
          {
            inspection_grade: cleanGrade,
            inspection_notes: inspectionData.notes || inspectionNotes || null,
            is_restocked: shouldRestock,
            restocked_at: shouldRestock ? completedAt : null,
          },
          tx,
        );
      }

      const finalStatus = hasAnyPass ? 'COMPLETED' : 'REJECTED';

      const updated = await this.returnRepo.updateReturnStatus(
        id,
        {
          status: finalStatus,
          completed_at: completedAt,
        },
        tx,
      );

      await this.returnRepo.addTrackingUpdate(
        {
          return_pickup_id: id,
          status: finalStatus,
          location: returnPickup.warehouse?.city || 'Warehouse QC Station',
          description: `Quality inspection completed. Final status: ${finalStatus}`,
          recorded_at: completedAt,
        },
        tx,
      );

      // Emit return.completed event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.RETURN_COMPLETED,
          aggregateType: 'ReturnPickup',
          aggregateId: updated.id,
          payload: {
            returnId: updated.id,
            returnNumber: updated.return_number,
            orderId: updated.order_id,
            userId: updated.user_id,
            warehouseId: updated.warehouse_id,
            status: updated.status,
            completedAt: (updated.completed_at || completedAt).toISOString(),
          },
        },
        tx,
      );

      return updated;
    });
  }

  /**
   * Retrieves sanitized reverse logistics tracking timeline
   */
  async getTrackingTimeline(returnTrackingNumber) {
    if (!returnTrackingNumber || typeof returnTrackingNumber !== 'string') {
      throw new ValidationError('Valid return tracking number is required');
    }

    const returnPickup = await this.returnRepo.findByTrackingNumber(returnTrackingNumber.trim());
    if (!returnPickup) {
      throw new NotFoundError(
        `Return pickup with tracking number '${returnTrackingNumber}' not found`,
      );
    }

    return {
      returnNumber: returnPickup.return_number,
      returnTrackingNumber: returnPickup.return_tracking_number,
      courierCode: returnPickup.courier_code,
      status: returnPickup.status,
      scheduledPickupDate: returnPickup.scheduled_pickup_date,
      pickedUpAt: returnPickup.picked_up_at,
      receivedAt: returnPickup.received_at,
      completedAt: returnPickup.completed_at,
      trackingUpdates: (returnPickup.tracking_updates || []).map((u) => ({
        status: u.status,
        location: u.location,
        description: u.description,
        recordedAt: u.recorded_at,
      })),
    };
  }

  /**
   * Retrieves return details with IDOR protection
   */
  async getReturnById(id, { userId, userRole, authSellerId } = {}) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid return pickup ID is required');
    }

    const returnPickup = await this.returnRepo.findById(id);
    if (!returnPickup) {
      throw new NotFoundError(`Return pickup with ID '${id}' not found`);
    }

    if (userRole === 'CUSTOMER' && returnPickup.user_id !== userId) {
      throw new ForbiddenError('Access denied: Cannot view return belonging to another user');
    }

    if (userRole === 'SELLER') {
      const hasSellerItem = (returnPickup.items || []).some(
        (i) => i.seller_id && authSellerId && i.seller_id === authSellerId,
      );
      if (!hasSellerItem) {
        throw new ForbiddenError(
          'Access denied: Return does not contain products from your seller account',
        );
      }
    }

    return returnPickup;
  }

  /**
   * Lists returns with filtering, RBAC scoping, and pagination
   */
  async listReturns(
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

    const { items, total } = await this.returnRepo.findMany(query);

    return {
      returns: items,
      pagination: buildPaginationMeta({ page: pageNum, limit: limitNum, total }),
    };
  }
}

export const returnPickupService = new ReturnPickupService();
