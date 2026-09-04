import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from '@ecommerce/shared';

import { ProductRepository } from '../repositories/product-repository.js';
import { CategoryRepository } from '../repositories/category-repository.js';

export class ProductService {
  constructor({
    productRepo = new ProductRepository(),
    categoryRepo = new CategoryRepository(),
  } = {}) {
    this.productRepo = productRepo;
    this.categoryRepo = categoryRepo;
  }

  async getProductDetails(idOrSlug) {
    let product;
    // Check if idOrSlug is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    if (isUuid) {
      product = await this.productRepo.findById(idOrSlug);
    } else {
      product = await this.productRepo.findBySlug(idOrSlug);
    }

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return {
      ...product,
      reviews_summary: {
        average_rating: Number(product.average_rating) || 0,
        total_reviews: product.total_reviews || 0,
        recent_reviews: [], // Placeholder for Phase 4 reviews
      },
    };
  }

  async browseProducts(options) {
    return await this.productRepo.browse(options);
  }

  async searchProducts(options) {
    return await this.productRepo.search(options);
  }

  async autocomplete(prefix) {
    return await this.productRepo.autocomplete({ prefix });
  }

  async listSellerProducts(sellerId, options) {
    return await this.productRepo.listSellerProducts(sellerId, options);
  }

  async createProduct(sellerId, data) {
    if (!sellerId) {
      throw new ForbiddenError('Only active sellers can create products');
    }

    // Verify category exists
    const category = await this.categoryRepo.findById(data.categoryId);
    if (!category) {
      throw new BadRequestError('Invalid category ID');
    }

    const slug = data.slug
      ? data.slug.toLowerCase().trim()
      : (data.title || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

    const existingSlug = await this.productRepo.findBySlug(slug);
    if (existingSlug) {
      throw new ConflictError('A product with this slug already exists');
    }

    const existingSku = await this.productRepo.findBySku(data.sku);
    if (existingSku) {
      throw new ConflictError('A product with this SKU already exists');
    }

    let status = data.status || 'DRAFT';
    if (status === 'ACTIVE') {
      status = 'PUBLISHED';
    }
    const allowedStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
    }

    return this.productRepo.create({
      sellerId,
      ...data,
      status,
      slug,
    });
  }

  async updateProduct(productId, sellerId, data) {
    const existing = await this.productRepo.findById(productId);
    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    if (existing.seller_id !== sellerId) {
      throw new ForbiddenError('You are not authorized to modify this product');
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await this.productRepo.findBySlug(data.slug);
      if (slugConflict && slugConflict.id !== productId) {
        throw new ConflictError('A product with this slug already exists');
      }
    }

    if (data.sku && data.sku !== existing.sku) {
      const skuConflict = await this.productRepo.findBySku(data.sku);
      if (skuConflict && skuConflict.id !== productId) {
        throw new ConflictError('A product with this SKU already exists');
      }
    }

    const updateData = { ...data };
    if (updateData.status === 'ACTIVE') {
      updateData.status = 'PUBLISHED';
    }
    if (updateData.status && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(updateData.status)) {
      throw new BadRequestError('Invalid status. Allowed values: DRAFT, PUBLISHED, ARCHIVED');
    }

    return this.productRepo.update(productId, updateData);
  }

  async deleteProduct(productId, sellerId) {
    const existing = await this.productRepo.findById(productId);
    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    if (existing.seller_id !== sellerId) {
      throw new ForbiddenError('You are not authorized to delete this product');
    }

    return this.productRepo.delete(productId);
  }

  async addProductImage(productId, sellerId, imageData) {
    const existing = await this.productRepo.findById(productId);
    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    if (existing.seller_id !== sellerId) {
      throw new ForbiddenError('You are not authorized to modify this product');
    }

    return this.productRepo.addImage(productId, imageData);
  }

  async deleteProductImage(productId, sellerId, imageId) {
    const existing = await this.productRepo.findById(productId);
    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    if (existing.seller_id !== sellerId) {
      throw new ForbiddenError('You are not authorized to modify this product');
    }

    return this.productRepo.deleteImage(productId, imageId);
  }
}
