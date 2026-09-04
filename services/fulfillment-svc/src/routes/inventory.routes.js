import { Router } from 'express';
import { authenticate, optionalAuthenticate, requireRole, Roles } from '@ecommerce/shared';

import { inventoryController as defaultInventoryController } from '../controllers/inventory.controller.js';

export function createInventoryRouter({ controller = defaultInventoryController } = {}) {
  const router = Router();

  // Stock check endpoint: accessible to authenticated customers, sellers, admins, or guest users
  router.get('/check', optionalAuthenticate, controller.checkStock);
  router.post('/check', optionalAuthenticate, controller.checkStock);

  // Authenticated routes for inventory management
  router.use(authenticate);

  // ADMIN and SELLER: Stock intake
  router.post('/stock', requireRole(Roles.ADMIN, Roles.SELLER), controller.intakeStock);

  // ADMIN and SELLER: Adjust stock
  router.patch('/:id', requireRole(Roles.ADMIN, Roles.SELLER), controller.adjustStock);
  router.post('/adjust', requireRole(Roles.ADMIN, Roles.SELLER), controller.adjustStock);

  // ADMIN and SELLER: List inventory items
  router.get('/', requireRole(Roles.ADMIN, Roles.SELLER), controller.listInventory);

  return router;
}

export const inventoryRouter = createInventoryRouter();
