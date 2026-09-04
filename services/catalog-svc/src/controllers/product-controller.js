import { successResponse, buildPaginationMeta, parsePagination } from '@ecommerce/shared';

import { ProductService } from '../services/product-service.js';

export class ProductController {
  constructor(productService = new ProductService()) {
    this.productService = productService;
  }

  browse = async (req, res, next) => {
    try {
      const { page, limit, skip } = parsePagination(req.query);
      const { categoryId, minPrice, maxPrice, brand, minRating, inStock, sort } = req.query;

      const { products, total } = await this.productService.browseProducts({
        categoryId,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        brand,
        minRating: minRating ? parseFloat(minRating) : undefined,
        inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
        sort,
        skip,
        limit,
      });

      const paginationMeta = buildPaginationMeta({ page, limit, total });

      return res.status(200).json(
        successResponse({
          data: products,
          meta: paginationMeta,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  search = async (req, res, next) => {
    try {
      const { page, limit, skip } = parsePagination(req.query);
      const { q } = req.query;

      const { products, total } = await this.productService.searchProducts({
        query: q,
        skip,
        limit,
      });

      const paginationMeta = buildPaginationMeta({ page, limit, total });

      return res.status(200).json(
        successResponse({
          data: products,
          meta: paginationMeta,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  autocomplete = async (req, res, next) => {
    try {
      const { q, limit = 10 } = req.query;
      const suggestions = await this.productService.autocomplete(q, parseInt(limit, 10));
      return res.status(200).json(
        successResponse({
          data: suggestions,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  getDetails = async (req, res, next) => {
    try {
      const product = await this.productService.getProductDetails(req.params.idOrSlug);
      return res.status(200).json(
        successResponse({
          data: product,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  // Seller specific endpoints
  listSellerProducts = async (req, res, next) => {
    try {
      const { page, limit, skip } = parsePagination(req.query);
      const sellerId = req.user.sellerId;

      const { products, total } = await this.productService.listSellerProducts(sellerId, {
        skip,
        limit,
      });

      const paginationMeta = buildPaginationMeta({ page, limit, total });

      return res.status(200).json(
        successResponse({
          data: products,
          meta: paginationMeta,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const sellerId = req.user.sellerId;
      const product = await this.productService.createProduct(sellerId, req.body);
      return res.status(201).json(
        successResponse({
          data: product,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const sellerId = req.user.sellerId;
      const product = await this.productService.updateProduct(req.params.id, sellerId, req.body);
      return res.status(200).json(
        successResponse({
          data: product,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const sellerId = req.user.sellerId;
      await this.productService.deleteProduct(req.params.id, sellerId);
      return res.status(200).json(
        successResponse({
          data: { message: 'Product successfully deleted' },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  addImage = async (req, res, next) => {
    try {
      const sellerId = req.user.sellerId;
      const image = await this.productService.addProductImage(req.params.id, sellerId, req.body);
      return res.status(201).json(
        successResponse({
          data: image,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  deleteImage = async (req, res, next) => {
    try {
      const sellerId = req.user.sellerId;
      await this.productService.deleteProductImage(req.params.id, sellerId, req.params.imageId);
      return res.status(200).json(
        successResponse({
          data: { message: 'Image successfully deleted' },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
