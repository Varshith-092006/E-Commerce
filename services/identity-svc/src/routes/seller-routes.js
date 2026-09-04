import { Router } from 'express';
import { authenticate, requireAdmin, requireSeller } from '@ecommerce/shared';

import { SellerController } from '../controllers/seller-controller.js';

export function createSellerRoutes(sellerController = new SellerController()) {
  const router = Router();

  router.use(authenticate);

  router.get('/me', requireSeller, sellerController.getMe);
  router.put('/me', requireSeller, sellerController.updateMe);

  router.get('/admin/list', requireAdmin, sellerController.listForAdmin);
  router.patch('/admin/:id/status', requireAdmin, sellerController.updateStatusByAdmin);

  return router;
}
