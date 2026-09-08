import { getRedisClient, CacheService, CacheKeys } from '@ecommerce/shared';

import { prisma } from '../lib/prisma.js';
import { config } from '../config/index.js';

export class ProductRepository {
  constructor(db = prisma, cacheService = null) {
    this.db = db;
    if (cacheService) {
      this.cache = cacheService;
    } else {
      try {
        const redis = config.redisUrl ? getRedisClient(config.redisUrl) : null;
        this.cache = new CacheService({
          redisClient: redis,
          enabled: config.cache.enabled,
          defaultNamespace: 'catalog',
          defaultTtl: config.cache.productTtl,
        });
      } catch {
        this.cache = new CacheService({ redisClient: null, enabled: false });
      }
    }
  }

  async findById(id) {
    if (!id) {
      return null;
    }
    const cacheKey = CacheKeys.catalog.product(id);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await this.db.product.findUnique({
          where: { id },
          include: {
            category: true,
            images: { orderBy: { display_order: 'asc' } },
          },
        });
      },
      config.cache.productTtl,
    );
  }

  async findBySlug(slug) {
    if (!slug) {
      return null;
    }
    const normalized = slug.toLowerCase().trim();
    const cacheKey = `catalog:product:slug:${normalized}`;

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await this.db.product.findUnique({
          where: { slug: normalized },
          include: {
            category: true,
            images: { orderBy: { display_order: 'asc' } },
          },
        });
      },
      config.cache.productTtl,
    );
  }

  async findBySku(sku) {
    return await this.db.product.findUnique({
      where: { sku: sku.trim() },
    });
  }

  async create(data) {
    const created = await this.db.product.create({
      data: {
        seller_id: data.sellerId,
        category_id: data.categoryId,
        title: data.title.trim(),
        slug: data.slug.toLowerCase().trim(),
        description: data.description.trim(),
        brand: data.brand.trim(),
        sku: data.sku.trim(),
        price: data.price,
        compare_at_price: data.compareAtPrice || null,
        status: data.status || 'DRAFT',
        is_available: data.isAvailable !== undefined ? data.isAvailable : true,
        attributes: data.attributes || {},
      },
      include: { category: true, images: true },
    });

    // Invalidate product listings, searches, and autocomplete after write
    await this.invalidateListingAndSearchCaches();

    return created;
  }

  async update(id, data) {
    const updated = await this.db.product.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.slug !== undefined && { slug: data.slug.toLowerCase().trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.brand !== undefined && { brand: data.brand.trim() }),
        ...(data.categoryId !== undefined && { category_id: data.categoryId }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.compareAtPrice !== undefined && { compare_at_price: data.compareAtPrice }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.isAvailable !== undefined && { is_available: data.isAvailable }),
        ...(data.attributes !== undefined && { attributes: data.attributes }),
      },
      include: { category: true, images: true },
    });

    await this.invalidateProductCache(id, updated.slug);
    await this.invalidateListingAndSearchCaches();

    return updated;
  }

  async delete(id) {
    const deleted = await this.db.product.delete({
      where: { id },
    });

    await this.invalidateProductCache(id, deleted?.slug);
    await this.invalidateListingAndSearchCaches();

    return deleted;
  }

  async invalidateProductCache(id, slug = null) {
    await this.cache.delete(CacheKeys.catalog.product(id));
    if (slug) {
      await this.cache.delete(`catalog:product:slug:${slug.toLowerCase().trim()}`);
    }
  }

  async invalidateListingAndSearchCaches() {
    await Promise.all([
      this.cache.deleteByPattern(CacheKeys.catalog.productsPattern()),
      this.cache.deleteByPattern(CacheKeys.catalog.searchPattern()),
      this.cache.deleteByPattern(CacheKeys.catalog.autocompletePattern()),
    ]);
  }

  async listSellerProducts(sellerId, { skip = 0, limit = 20 } = {}) {
    const where = { seller_id: sellerId };
    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { category: true, images: true },
      }),
      this.db.product.count({ where }),
    ]);

    return { products, total };
  }

  async browse({
    categoryId,
    minPrice,
    maxPrice,
    brand,
    minRating,
    inStock,
    sort = 'newest',
    skip = 0,
    limit = 20,
  } = {}) {
    const queryParams = {
      categoryId,
      minPrice,
      maxPrice,
      brand,
      minRating,
      inStock,
      sort,
      skip,
      limit,
    };
    const cacheKey = CacheKeys.catalog.products(queryParams);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const where = {
          status: 'PUBLISHED',
          ...(categoryId && { category_id: categoryId }),
          ...(brand && { brand: { equals: brand, mode: 'insensitive' } }),
          ...(inStock !== undefined && { is_available: inStock }),
          ...(minRating && { average_rating: { gte: minRating } }),
        };

        if (minPrice !== undefined || maxPrice !== undefined) {
          where.price = {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          };
        }

        let orderBy = { created_at: 'desc' };
        if (sort === 'price_asc') {
          orderBy = { price: 'asc' };
        }
        if (sort === 'price_desc') {
          orderBy = { price: 'desc' };
        }
        if (sort === 'rating') {
          orderBy = { average_rating: 'desc' };
        }

        const [products, total] = await Promise.all([
          this.db.product.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
              category: true,
              images: { orderBy: { display_order: 'asc' } },
            },
          }),
          this.db.product.count({ where }),
        ]);

        return { products, total };
      },
      config.cache.productListTtl,
    );
  }

  async search({ query, skip = 0, limit = 20 } = {}) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return { products: [], total: 0 };
    }

    const sanitized = query.trim();
    const queryParams = { query: sanitized, skip, limit };
    const cacheKey = CacheKeys.catalog.search(queryParams);

    // Using stampede protection on expensive search operations
    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const where = {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: sanitized, mode: 'insensitive' } },
            { description: { contains: sanitized, mode: 'insensitive' } },
            { brand: { contains: sanitized, mode: 'insensitive' } },
          ],
        };

        const [products, total] = await Promise.all([
          this.db.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { average_rating: 'desc' },
            include: {
              category: true,
              images: { orderBy: { display_order: 'asc' } },
            },
          }),
          this.db.product.count({ where }),
        ]);

        return { products, total };
      },
      config.cache.searchTtl,
      { stampedeProtection: true, lockTimeoutMs: 3000 },
    );
  }

  async autocomplete({ prefix, limit = 10 } = {}) {
    if (!prefix || typeof prefix !== 'string' || !prefix.trim()) {
      return [];
    }

    const sanitizedPrefix = prefix.trim();
    const cacheKey = CacheKeys.catalog.autocomplete(`${sanitizedPrefix}:${limit}`);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const products = await this.db.product.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { startsWith: sanitizedPrefix, mode: 'insensitive' } },
              { brand: { startsWith: sanitizedPrefix, mode: 'insensitive' } },
            ],
          },
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            brand: true,
            price: true,
          },
        });

        return products;
      },
      config.cache.autocompleteTtl,
    );
  }

  async addImage(productId, { url, publicId, altText, displayOrder, isThumbnail }) {
    const image = await this.db.productImage.create({
      data: {
        product_id: productId,
        url,
        public_id: publicId,
        alt_text: altText || null,
        display_order: displayOrder || 0,
        is_thumbnail: isThumbnail || false,
      },
    });

    await this.invalidateProductCache(productId);
    return image;
  }

  async deleteImage(productId, imageId) {
    const deleted = await this.db.productImage.delete({
      where: { id: imageId, product_id: productId },
    });

    await this.invalidateProductCache(productId);
    return deleted;
  }
}
