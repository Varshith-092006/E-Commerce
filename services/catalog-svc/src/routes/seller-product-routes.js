import { Router } from 'express';
import { authenticate, requireSeller } from '@ecommerce/shared';

import { ProductController } from '../controllers/product-controller.js';

export function createSellerProductRoutes(productController = new ProductController()) {
  const router = Router();

  router.use(authenticate);
  router.use(requireSeller);

  router.get('/', productController.listSellerProducts);
  router.post('/', productController.createProduct);
  router.put('/:id', productController.updateProduct);
  router.delete('/:id', productController.deleteProduct);

  router.post('/:id/images', productController.addImage);
  router.delete('/:id/images/:imageId', productController.deleteImage);

  return router;
}
