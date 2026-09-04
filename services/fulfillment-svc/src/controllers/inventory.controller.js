import { successResponse } from '@ecommerce/shared';

import { inventoryReservationService as defaultInventoryService } from '../services/inventory-reservation.service.js';

export class InventoryController {
  constructor(inventoryService = defaultInventoryService) {
    this.inventoryService = inventoryService;
  }

  intakeStock = async (req, res, next) => {
    try {
      const item = await this.inventoryService.intakeStock({
        productId: req.body.productId || req.body.product_id,
        sku: req.body.sku,
        warehouseId: req.body.warehouseId || req.body.warehouse_id,
        sellerId: req.body.sellerId || req.body.seller_id,
        quantity: req.body.quantity,
        safetyStock:
          req.body.safetyStock !== undefined ? req.body.safetyStock : req.body.safety_stock,
        reorderThreshold:
          req.body.reorderThreshold !== undefined
            ? req.body.reorderThreshold
            : req.body.reorder_threshold,
        userRole: req.user?.role,
        authSellerId: req.user?.sellerId || req.user?.id,
      });

      return res.status(201).json(
        successResponse({
          data: item,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  adjustStock = async (req, res, next) => {
    try {
      const id = req.params.id || req.body.inventoryItemId || req.body.id;
      const item = await this.inventoryService.adjustStock(id, {
        quantityDelta:
          req.body.quantityDelta !== undefined ? req.body.quantityDelta : req.body.quantity_delta,
        safetyStock:
          req.body.safetyStock !== undefined ? req.body.safetyStock : req.body.safety_stock,
        reorderThreshold:
          req.body.reorderThreshold !== undefined
            ? req.body.reorderThreshold
            : req.body.reorder_threshold,
        expectedVersion:
          req.body.expectedVersion !== undefined
            ? req.body.expectedVersion
            : req.body.expected_version,
        userRole: req.user?.role,
        authSellerId: req.user?.sellerId || req.user?.id,
      });

      return res.status(200).json(
        successResponse({
          data: item,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  checkStock = async (req, res, next) => {
    try {
      let items = req.body?.items;
      if (!items && (req.query.sku || req.query.productId || req.query.product_id)) {
        items = [
          {
            sku: req.query.sku,
            productId: req.query.productId || req.query.product_id,
            warehouseId: req.query.warehouseId || req.query.warehouse_id,
            requestedQuantity: parseInt(
              req.query.quantity || req.query.requestedQuantity || '1',
              10,
            ),
          },
        ];
      }

      const results = await this.inventoryService.checkStock({ items: items || [] });
      return res.status(200).json(
        successResponse({
          data: results.length === 1 && !req.body?.items ? results[0] : results,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  listInventory = async (req, res, next) => {
    try {
      const { inventory, pagination } = await this.inventoryService.listInventory({
        productId: req.query.productId || req.query.product_id,
        sku: req.query.sku,
        warehouseId: req.query.warehouseId || req.query.warehouse_id,
        sellerId: req.query.sellerId || req.query.seller_id,
        isActive: req.query.isActive !== undefined ? req.query.isActive : req.query.is_active,
        page: req.query.page,
        limit: req.query.limit,
        userRole: req.user?.role,
        authSellerId: req.user?.sellerId || req.user?.id,
      });

      return res.status(200).json(
        successResponse({
          data: inventory,
          meta: { pagination, requestId: req.id },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const inventoryController = new InventoryController();
