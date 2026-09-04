import { Router } from 'express';
import { authenticate, requireAdmin } from '@ecommerce/shared';

import { CategoryController } from '../controllers/category-controller.js';

export function createCategoryRoutes(categoryController = new CategoryController()) {
  const router = Router();

  // Public category hierarchy
  router.get('/', categoryController.getTree);

  // Admin managed category endpoints
  router.post('/', authenticate, requireAdmin, categoryController.create);
  router.put('/:id', authenticate, requireAdmin, categoryController.update);
  router.delete('/:id', authenticate, requireAdmin, categoryController.delete);

  return router;
}
