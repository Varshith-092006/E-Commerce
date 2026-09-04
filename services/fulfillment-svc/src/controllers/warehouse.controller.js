import { successResponse } from '@ecommerce/shared';

import { warehouseService as defaultWarehouseService } from '../services/warehouse.service.js';

export class WarehouseController {
  constructor(warehouseService = defaultWarehouseService) {
    this.warehouseService = warehouseService;
  }

  createWarehouse = async (req, res, next) => {
    try {
      const warehouse = await this.warehouseService.createWarehouse(req.body);
      return res.status(201).json(
        successResponse({
          data: warehouse,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  updateWarehouse = async (req, res, next) => {
    try {
      const warehouse = await this.warehouseService.updateWarehouse(req.params.id, req.body);
      return res.status(200).json(
        successResponse({
          data: warehouse,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  getWarehouseById = async (req, res, next) => {
    try {
      const warehouse = await this.warehouseService.getWarehouseById(req.params.id);
      return res.status(200).json(
        successResponse({
          data: warehouse,
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  listWarehouses = async (req, res, next) => {
    try {
      const { warehouses, pagination } = await this.warehouseService.listWarehouses(req.query);
      return res.status(200).json(
        successResponse({
          data: warehouses,
          meta: { pagination, requestId: req.id },
          requestId: req.id,
        }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export const warehouseController = new WarehouseController();
