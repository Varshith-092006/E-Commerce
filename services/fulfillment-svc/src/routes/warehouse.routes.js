import { Router } from 'express';
import { authenticate, requireAdmin, requireRole, Roles } from '@ecommerce/shared';

import { warehouseController as defaultWarehouseController } from '../controllers/warehouse.controller.js';

export function createWarehouseRouter({ controller = defaultWarehouseController } = {}) {
  const router = Router();

  router.use(authenticate);

  // ADMIN only: Create warehouse
  router.post('/', requireAdmin, controller.createWarehouse);

  // ADMIN and SELLER: List warehouses
  router.get('/', requireRole(Roles.ADMIN, Roles.SELLER), controller.listWarehouses);

  // ADMIN and SELLER: Get warehouse details
  router.get('/:id', requireRole(Roles.ADMIN, Roles.SELLER), controller.getWarehouseById);

  // ADMIN only: Update warehouse
  router.patch('/:id', requireAdmin, controller.updateWarehouse);

  return router;
}

export const warehouseRouter = createWarehouseRouter();
