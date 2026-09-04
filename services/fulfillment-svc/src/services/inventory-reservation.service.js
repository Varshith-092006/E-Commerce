import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  BusinessRuleError,
  ErrorCodes,
  EventTypes,
  buildPaginationMeta,
} from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';
import { inventoryRepository as defaultInventoryRepo } from '../repositories/inventory.repository.js';
import { reservationRepository as defaultReservationRepo } from '../repositories/reservation.repository.js';
import { warehouseRepository as defaultWarehouseRepo } from '../repositories/warehouse.repository.js';
import { fulfillmentOutboxRepository as defaultOutboxRepo } from '../repositories/outbox.repository.js';
import { config } from '../config/index.js';

export class InventoryReservationService {
  constructor({
    prismaClient = defaultPrisma,
    inventoryRepo = defaultInventoryRepo,
    reservationRepo = defaultReservationRepo,
    warehouseRepo = defaultWarehouseRepo,
    outboxRepo = defaultOutboxRepo,
    defaultTtlSeconds = config.reservationTtlSeconds || 900,
  } = {}) {
    this.prisma = prismaClient;
    this.inventoryRepo = inventoryRepo;
    this.reservationRepo = reservationRepo;
    this.warehouseRepo = warehouseRepo;
    this.outboxRepo = outboxRepo;
    this.defaultTtlSeconds = defaultTtlSeconds;
  }

  /**
   * Helper to compute available stock
   */
  _calculateAvailable(item) {
    if (!item) {
      return 0;
    }
    const onHand = item.quantity_on_hand || 0;
    const reserved = item.quantity_reserved || 0;
    const allocated = item.quantity_allocated || 0;
    return Math.max(0, onHand - reserved - allocated);
  }

  /**
   * Stock intake / creation
   */
  async intakeStock({
    productId,
    sku,
    warehouseId,
    sellerId = null,
    quantity,
    safetyStock = 0,
    reorderThreshold = 10,
    userRole,
    authSellerId,
  }) {
    if (!productId || typeof productId !== 'string') {
      throw new ValidationError('Product ID is required and must be a valid UUID');
    }
    if (!sku || typeof sku !== 'string' || !sku.trim()) {
      throw new ValidationError('SKU is required and must be a valid string');
    }
    if (!warehouseId || typeof warehouseId !== 'string') {
      throw new ValidationError('Warehouse ID is required and must be a valid UUID');
    }
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError('Quantity must be a positive integer');
    }
    if (typeof safetyStock !== 'number' || safetyStock < 0) {
      throw new ValidationError('Safety stock must be a non-negative integer');
    }
    if (typeof reorderThreshold !== 'number' || reorderThreshold < 0) {
      throw new ValidationError('Reorder threshold must be a non-negative integer');
    }

    // Role-based seller scoping
    let targetSellerId = sellerId;
    if (userRole === 'SELLER') {
      if (authSellerId && sellerId && sellerId !== authSellerId) {
        throw new ForbiddenError('Sellers can only manage inventory for their own seller account');
      }
      targetSellerId = authSellerId || sellerId;
    }

    // Verify warehouse exists and is active
    const warehouse = await this.warehouseRepo.findById(warehouseId);
    if (!warehouse) {
      throw new NotFoundError(`Warehouse with ID '${warehouseId}' not found`);
    }
    if (!warehouse.is_active) {
      throw new BusinessRuleError(
        `Warehouse '${warehouse.code}' is inactive and cannot accept stock`,
      );
    }

    const cleanSku = sku.trim().toUpperCase();

    // Execute in transaction: upsert stock and check for low stock
    return await this.prisma.$transaction(async (tx) => {
      const item = await this.inventoryRepo.upsertStock(
        {
          product_id: productId,
          sku: cleanSku,
          warehouse_id: warehouseId,
          seller_id: targetSellerId,
          quantity_on_hand: quantity,
          safety_stock: safetyStock,
          reorder_threshold: reorderThreshold,
          is_active: true,
        },
        tx,
      );

      const available = this._calculateAvailable(item);
      if (available <= item.reorder_threshold) {
        await this.outboxRepo.createEvent(
          {
            eventType: EventTypes.INVENTORY_LOW_STOCK,
            aggregateType: 'InventoryItem',
            aggregateId: item.id,
            payload: {
              inventoryItemId: item.id,
              productId: item.product_id,
              sku: item.sku,
              warehouseId: item.warehouse_id,
              quantityOnHand: item.quantity_on_hand,
              quantityReserved: item.quantity_reserved,
              quantityAllocated: item.quantity_allocated,
              availableQuantity: available,
              reorderThreshold: item.reorder_threshold,
            },
          },
          tx,
        );
      }

      return item;
    });
  }

  /**
   * Adjust existing stock quantity or thresholds
   */
  async adjustStock(
    id,
    { quantityDelta, safetyStock, reorderThreshold, expectedVersion, userRole, authSellerId },
  ) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Inventory Item ID is required');
    }

    const existing = await this.inventoryRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Inventory item with ID '${id}' not found`);
    }

    if (userRole === 'SELLER') {
      if (existing.seller_id && authSellerId && existing.seller_id !== authSellerId) {
        throw new ForbiddenError('Access denied: Cannot modify inventory owned by another seller');
      }
    }

    if (quantityDelta !== undefined) {
      if (typeof quantityDelta !== 'number' || !Number.isInteger(quantityDelta)) {
        throw new ValidationError('Quantity delta must be an integer');
      }
      const newOnHand = existing.quantity_on_hand + quantityDelta;
      if (newOnHand < existing.quantity_reserved + existing.quantity_allocated) {
        throw new BusinessRuleError(
          `Cannot reduce stock below reserved and allocated quantities (Reserved: ${existing.quantity_reserved}, Allocated: ${existing.quantity_allocated})`,
        );
      }
      if (newOnHand < 0) {
        throw new BusinessRuleError('Total stock on hand cannot become negative');
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await this.inventoryRepo.adjustStock(
        id,
        {
          quantity_delta: quantityDelta,
          safety_stock: safetyStock,
          reorder_threshold: reorderThreshold,
          expected_version: expectedVersion,
        },
        tx,
      );

      const available = this._calculateAvailable(updated);
      if (available <= updated.reorder_threshold) {
        await this.outboxRepo.createEvent(
          {
            eventType: EventTypes.INVENTORY_LOW_STOCK,
            aggregateType: 'InventoryItem',
            aggregateId: updated.id,
            payload: {
              inventoryItemId: updated.id,
              productId: updated.product_id,
              sku: updated.sku,
              warehouseId: updated.warehouse_id,
              quantityOnHand: updated.quantity_on_hand,
              quantityReserved: updated.quantity_reserved,
              quantityAllocated: updated.quantity_allocated,
              availableQuantity: available,
              reorderThreshold: updated.reorder_threshold,
            },
          },
          tx,
        );
      }

      return updated;
    });
  }

  /**
   * Check stock availability for single or multiple items
   */
  async checkStock({ items = [] }) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items array is required and must not be empty');
    }

    const results = [];
    for (const item of items) {
      const { productId, sku, warehouseId, requestedQuantity = 1 } = item;
      if (!sku && !productId) {
        throw new ValidationError('Each item must specify at least sku or productId');
      }

      let inventoryItems = [];
      if (warehouseId && sku) {
        const found = await this.inventoryRepo.findByWarehouseAndSku(
          warehouseId,
          sku.trim().toUpperCase(),
        );
        if (found) {
          inventoryItems = [found];
        }
      } else if (sku) {
        inventoryItems = await this.inventoryRepo.findBySku(sku.trim().toUpperCase());
      } else if (productId) {
        inventoryItems = await this.inventoryRepo.findByProductId(productId);
      }

      const totalOnHand = inventoryItems.reduce((acc, i) => acc + i.quantity_on_hand, 0);
      const totalReserved = inventoryItems.reduce((acc, i) => acc + i.quantity_reserved, 0);
      const totalAllocated = inventoryItems.reduce((acc, i) => acc + i.quantity_allocated, 0);
      const totalAvailable = Math.max(0, totalOnHand - totalReserved - totalAllocated);

      results.push({
        productId: productId || inventoryItems[0]?.product_id || null,
        sku: sku ? sku.trim().toUpperCase() : inventoryItems[0]?.sku || null,
        warehouseId: warehouseId || null,
        quantityOnHand: totalOnHand,
        quantityReserved: totalReserved,
        quantityAllocated: totalAllocated,
        availableQuantity: totalAvailable,
        isAvailable: totalAvailable >= requestedQuantity,
        warehouses: inventoryItems.map((inv) => ({
          warehouseId: inv.warehouse_id,
          warehouseCode: inv.warehouse?.code || null,
          quantityOnHand: inv.quantity_on_hand,
          quantityReserved: inv.quantity_reserved,
          quantityAllocated: inv.quantity_allocated,
          availableQuantity: this._calculateAvailable(inv),
        })),
      });
    }

    return results;
  }

  /**
   * Creates an inventory reservation atomically with concurrency protection and idempotency
   */
  async createReservation({
    reservationKey,
    userId,
    orderId = null,
    ttlSeconds,
    items = [],
    userRole,
  }) {
    if (!reservationKey || typeof reservationKey !== 'string' || !reservationKey.trim()) {
      throw new ValidationError('Reservation key is required for idempotency');
    }
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('User ID is required');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Reservation must include at least one item');
    }

    const cleanKey = reservationKey.trim();
    const effectiveTtl = Math.max(60, parseInt(ttlSeconds, 10) || this.defaultTtlSeconds || 900);

    // Validate items
    for (const item of items) {
      if (!item.sku && !item.inventoryItemId) {
        throw new ValidationError('Item must include either sku or inventoryItemId');
      }
      if (
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new ValidationError('Item quantity must be a positive integer');
      }
    }

    // 1. Check idempotency: does reservation already exist with this key?
    const existing = await this.reservationRepo.findByReservationKey(cleanKey);
    if (existing) {
      // IDOR protection: ensure the reservation belongs to this user (unless admin/internal)
      if (userRole === 'CUSTOMER' && existing.user_id !== userId) {
        throw new ForbiddenError('Access denied: Reservation key belongs to another user');
      }
      return {
        reservation: existing,
        isIdempotent: true,
      };
    }

    // 2. Perform atomic reservation in transaction
    return await this.prisma.$transaction(async (tx) => {
      // Double check in transaction in case of concurrent key submission
      const existingInTx = await this.reservationRepo.findByReservationKey(cleanKey, tx);
      if (existingInTx) {
        if (userRole === 'CUSTOMER' && existingInTx.user_id !== userId) {
          throw new ForbiddenError('Access denied: Reservation key belongs to another user');
        }
        return {
          reservation: existingInTx,
          isIdempotent: true,
        };
      }

      const reservationItemsToCreate = [];
      const lowStockAlerts = [];

      // Sort items deterministically by SKU/ID to prevent DB deadlocks on concurrent reservations
      const sortedItems = [...items].sort((a, b) => {
        const keyA = a.inventoryItemId || a.sku || '';
        const keyB = b.inventoryItemId || b.sku || '';
        return keyA.localeCompare(keyB);
      });

      // Pass 1: Validate existence and stock availability for all items
      const resolvedItems = [];
      for (const item of sortedItems) {
        const reqQty = item.quantity;
        let inventoryItem = null;

        if (item.inventoryItemId) {
          inventoryItem = await this.inventoryRepo.findById(item.inventoryItemId, tx);
        } else if (item.warehouseId && item.sku) {
          inventoryItem = await this.inventoryRepo.findByWarehouseAndSku(
            item.warehouseId,
            item.sku.trim().toUpperCase(),
            tx,
          );
        } else if (item.sku) {
          const candidates = await this.inventoryRepo.findBySku(item.sku.trim().toUpperCase(), tx);
          for (const cand of candidates) {
            const avail = this._calculateAvailable(cand);
            if (avail >= reqQty) {
              inventoryItem = cand;
              break;
            }
          }
          if (!inventoryItem && candidates.length > 0) {
            inventoryItem = candidates[0];
          }
        }

        if (!inventoryItem) {
          const err = new BusinessRuleError(
            `Inventory not found for SKU '${item.sku || item.inventoryItemId}'`,
            { sku: item.sku, requestedQuantity: reqQty },
          );
          err.errorCode = ErrorCodes.INVENTORY_UNAVAILABLE;
          throw err;
        }

        const available = this._calculateAvailable(inventoryItem);
        if (available < reqQty) {
          const err = new BusinessRuleError(
            `Insufficient stock for SKU '${inventoryItem.sku}'. Requested: ${reqQty}, Available: ${available}`,
            {
              sku: inventoryItem.sku,
              productId: inventoryItem.product_id,
              warehouseId: inventoryItem.warehouse_id,
              requestedQuantity: reqQty,
              availableQuantity: available,
            },
          );
          err.errorCode = ErrorCodes.INVENTORY_UNAVAILABLE;
          throw err;
        }

        resolvedItems.push({ inventoryItem, reqQty });
      }

      // Pass 2: Atomically reserve stock and collect outbox low-stock alerts
      for (const { inventoryItem, reqQty } of resolvedItems) {
        let updated;
        try {
          updated = await this.inventoryRepo.reserveStock(inventoryItem.id, reqQty, tx);
        } catch (reserveErr) {
          if (reserveErr.code === 'INSUFFICIENT_STOCK') {
            const err = new BusinessRuleError(
              `Insufficient stock for SKU '${inventoryItem.sku}' (concurrent conflict detected)`,
              {
                sku: inventoryItem.sku,
                productId: inventoryItem.product_id,
                warehouseId: inventoryItem.warehouse_id,
                requestedQuantity: reqQty,
              },
            );
            err.errorCode = ErrorCodes.INVENTORY_UNAVAILABLE;
            throw err;
          }
          throw reserveErr;
        }

        const updatedItem = updated || {
          ...inventoryItem,
          quantity_reserved: (inventoryItem.quantity_reserved || 0) + reqQty,
        };

        reservationItemsToCreate.push({
          inventory_item_id: updatedItem.id,
          product_id: updatedItem.product_id,
          sku: updatedItem.sku,
          quantity: reqQty,
          warehouse_id: updatedItem.warehouse_id,
        });

        const newAvailable = this._calculateAvailable(updatedItem);
        if (newAvailable <= (updatedItem.reorder_threshold ?? 10)) {
          lowStockAlerts.push({
            inventoryItemId: updatedItem.id,
            productId: updatedItem.product_id,
            sku: updatedItem.sku,
            warehouseId: updatedItem.warehouse_id,
            quantityOnHand: updatedItem.quantity_on_hand,
            quantityReserved: updatedItem.quantity_reserved,
            quantityAllocated: updatedItem.quantity_allocated,
            availableQuantity: newAvailable,
            reorderThreshold: updatedItem.reorder_threshold ?? 10,
          });
        }
      }

      // Calculate explicit expires_at
      const expiresAt = new Date(Date.now() + effectiveTtl * 1000);

      // Create reservation record
      const reservation = await this.reservationRepo.createReservation(
        {
          reservation_key: cleanKey,
          user_id: userId,
          order_id: orderId,
          status: 'HELD',
          expires_at: expiresAt,
          items: reservationItemsToCreate,
        },
        tx,
      );

      // Write inventory.reserved outbox event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.INVENTORY_RESERVED,
          aggregateType: 'InventoryReservation',
          aggregateId: reservation.id,
          payload: {
            reservationId: reservation.id,
            reservationKey: reservation.reservation_key,
            userId: reservation.user_id,
            orderId: reservation.order_id,
            expiresAt: reservation.expires_at.toISOString(),
            items: reservationItemsToCreate.map((i) => ({
              inventoryItemId: i.inventory_item_id,
              productId: i.product_id,
              sku: i.sku,
              warehouseId: i.warehouse_id,
              quantity: i.quantity,
            })),
          },
        },
        tx,
      );

      // Emit low stock events
      for (const alert of lowStockAlerts) {
        await this.outboxRepo.createEvent(
          {
            eventType: EventTypes.INVENTORY_LOW_STOCK,
            aggregateType: 'InventoryItem',
            aggregateId: alert.inventoryItemId,
            payload: alert,
          },
          tx,
        );
      }

      return {
        reservation,
        isIdempotent: false,
      };
    });
  }

  /**
   * Commits an active HELD reservation (HELD -> COMMITTED)
   */
  async commitReservation({ reservationId, reservationKey, userId, userRole }) {
    if (!reservationId && !reservationKey) {
      throw new ValidationError('Reservation ID or reservation key is required');
    }

    const reservation = reservationId
      ? await this.reservationRepo.findById(reservationId)
      : await this.reservationRepo.findByReservationKey(reservationKey);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    // IDOR check
    if (userRole === 'CUSTOMER' && reservation.user_id !== userId) {
      throw new ForbiddenError(
        'Access denied: Cannot commit reservation belonging to another user',
      );
    }

    // Check existing status
    if (reservation.status === 'COMMITTED') {
      return reservation; // Idempotent return
    }
    if (reservation.status === 'RELEASED') {
      throw new BusinessRuleError('Cannot commit reservation: status is already RELEASED');
    }
    if (reservation.status === 'EXPIRED') {
      throw new BusinessRuleError('Cannot commit reservation: status is already EXPIRED');
    }

    // Check if expired by time
    const now = new Date();
    if (reservation.expires_at <= now) {
      // Auto-expire
      await this.expireSingleReservation(reservation.id);
      throw new BusinessRuleError('Cannot commit reservation: reservation has expired');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Move reserved -> allocated for all items
      for (const item of reservation.items) {
        await this.inventoryRepo.commitStock(item.inventory_item_id, item.quantity, tx);
      }

      // Update reservation status
      const committed = await this.reservationRepo.commitReservation(reservation.id, now, tx);

      // Write inventory.committed outbox event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.INVENTORY_COMMITTED,
          aggregateType: 'InventoryReservation',
          aggregateId: committed.id,
          payload: {
            reservationId: committed.id,
            reservationKey: committed.reservation_key,
            userId: committed.user_id,
            orderId: committed.order_id,
            committedAt: committed.committed_at.toISOString(),
            items: committed.items.map((i) => ({
              inventoryItemId: i.inventory_item_id,
              productId: i.product_id,
              sku: i.sku,
              quantity: i.quantity,
            })),
          },
        },
        tx,
      );

      return committed;
    });
  }

  /**
   * Releases an active HELD reservation (HELD -> RELEASED)
   */
  async releaseReservation({
    reservationId,
    reservationKey,
    userId,
    userRole,
    reason = 'MANUAL_RELEASE',
  }) {
    if (!reservationId && !reservationKey) {
      throw new ValidationError('Reservation ID or reservation key is required');
    }

    const reservation = reservationId
      ? await this.reservationRepo.findById(reservationId)
      : await this.reservationRepo.findByReservationKey(reservationKey);

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    // IDOR check
    if (userRole === 'CUSTOMER' && reservation.user_id !== userId) {
      throw new ForbiddenError(
        'Access denied: Cannot release reservation belonging to another user',
      );
    }

    // Check existing status
    if (reservation.status === 'RELEASED') {
      return reservation; // Idempotent return
    }
    if (reservation.status === 'COMMITTED') {
      throw new BusinessRuleError('Cannot release reservation: status is already COMMITTED');
    }
    if (reservation.status === 'EXPIRED') {
      return reservation; // Already expired / released
    }

    return await this.prisma.$transaction(async (tx) => {
      // Return reserved quantity back to available pool
      for (const item of reservation.items) {
        await this.inventoryRepo.releaseStock(item.inventory_item_id, item.quantity, tx);
      }

      const now = new Date();
      const released = await this.reservationRepo.releaseReservation(reservation.id, now, tx);

      // Write inventory.released outbox event
      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.INVENTORY_RELEASED,
          aggregateType: 'InventoryReservation',
          aggregateId: released.id,
          payload: {
            reservationId: released.id,
            reservationKey: released.reservation_key,
            userId: released.user_id,
            orderId: released.order_id,
            releasedAt: released.released_at.toISOString(),
            reason,
            items: released.items.map((i) => ({
              inventoryItemId: i.inventory_item_id,
              productId: i.product_id,
              sku: i.sku,
              quantity: i.quantity,
            })),
          },
        },
        tx,
      );

      return released;
    });
  }

  /**
   * Expire a single reservation (used on on-demand expiry check)
   */
  async expireSingleReservation(reservationId) {
    const reservation = await this.reservationRepo.findById(reservationId);
    if (!reservation || reservation.status !== 'HELD') {
      return reservation;
    }

    return await this.prisma.$transaction(async (tx) => {
      for (const item of reservation.items) {
        await this.inventoryRepo.releaseStock(item.inventory_item_id, item.quantity, tx);
      }

      const now = new Date();
      const expired = await this.reservationRepo.expireReservation(reservation.id, now, tx);

      await this.outboxRepo.createEvent(
        {
          eventType: EventTypes.INVENTORY_RELEASED,
          aggregateType: 'InventoryReservation',
          aggregateId: expired.id,
          payload: {
            reservationId: expired.id,
            reservationKey: expired.reservation_key,
            userId: expired.user_id,
            orderId: expired.order_id,
            releasedAt: (expired.expired_at || now).toISOString(),
            reason: 'EXPIRED',
            items: expired.items.map((i) => ({
              inventoryItemId: i.inventory_item_id,
              productId: i.product_id,
              sku: i.sku,
              quantity: i.quantity,
            })),
          },
        },
        tx,
      );

      return expired;
    });
  }

  /**
   * Sweeps and expires all stale HELD reservations whose TTL has elapsed
   */
  async expireStaleReservations({ limit = 100 } = {}) {
    const now = new Date();
    const staleReservations = await this.reservationRepo.findExpiredHeldReservations(now, limit);

    const expiredList = [];
    for (const reservation of staleReservations) {
      try {
        const expired = await this.expireSingleReservation(reservation.id);
        if (expired) {
          expiredList.push(expired);
        }
      } catch {
        // Continue processing others if single item fails
      }
    }

    return {
      expiredCount: expiredList.length,
      expiredReservations: expiredList,
    };
  }

  /**
   * Retrieves reservation by ID with IDOR check
   */
  async getReservationById(id, { userId, userRole }) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid reservation ID is required');
    }

    const reservation = await this.reservationRepo.findById(id);
    if (!reservation) {
      throw new NotFoundError(`Reservation with ID '${id}' not found`);
    }

    if (userRole === 'CUSTOMER' && reservation.user_id !== userId) {
      throw new ForbiddenError('Access denied: Cannot view reservation belonging to another user');
    }

    return reservation;
  }

  /**
   * Retrieves reservation by Key with IDOR check
   */
  async getReservationByKey(reservationKey, { userId, userRole }) {
    if (!reservationKey || typeof reservationKey !== 'string') {
      throw new ValidationError('Valid reservation key is required');
    }

    const reservation = await this.reservationRepo.findByReservationKey(reservationKey);
    if (!reservation) {
      throw new NotFoundError(`Reservation with key '${reservationKey}' not found`);
    }

    if (userRole === 'CUSTOMER' && reservation.user_id !== userId) {
      throw new ForbiddenError('Access denied: Cannot view reservation belonging to another user');
    }

    return reservation;
  }

  /**
   * Lists inventory items with filtering and pagination
   */
  async listInventory({
    productId,
    sku,
    warehouseId,
    sellerId,
    isActive,
    page = 1,
    limit = 20,
    userRole,
    authSellerId,
  } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    let targetSellerId = sellerId;
    if (userRole === 'SELLER') {
      targetSellerId = authSellerId || sellerId;
    }

    let activeFilter = undefined;
    if (isActive === 'true' || isActive === true) {
      activeFilter = true;
    }
    if (isActive === 'false' || isActive === false) {
      activeFilter = false;
    }

    const { items, total } = await this.inventoryRepo.findMany({
      product_id: productId,
      sku: sku ? sku.trim().toUpperCase() : undefined,
      warehouse_id: warehouseId,
      seller_id: targetSellerId,
      is_active: activeFilter,
      skip,
      take: limitNum,
    });

    const enrichedItems = items.map((item) => ({
      ...item,
      available_quantity: this._calculateAvailable(item),
    }));

    return {
      inventory: enrichedItems,
      ...buildPaginationMeta({ page: pageNum, limit: limitNum, total }),
    };
  }
}

export const inventoryReservationService = new InventoryReservationService();
