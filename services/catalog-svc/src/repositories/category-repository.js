import { getRedisClient, CacheService, CacheKeys } from '@ecommerce/shared';

import { prisma } from '../lib/prisma.js';
import { config } from '../config/index.js';

export class CategoryRepository {
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
          defaultTtl: config.cache.categoryTtl,
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
    const cacheKey = CacheKeys.catalog.category(id);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await this.db.category.findUnique({
          where: { id },
          include: { children: true, parent: true },
        });
      },
      config.cache.categoryTtl,
    );
  }

  async findBySlug(slug) {
    if (!slug) {
      return null;
    }
    const normalized = slug.toLowerCase().trim();
    const cacheKey = `catalog:category:slug:${normalized}`;

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await this.db.category.findUnique({
          where: { slug: normalized },
          include: { children: true, parent: true },
        });
      },
      config.cache.categoryTtl,
    );
  }

  async findAll({ activeOnly = true } = {}) {
    const cacheKey = CacheKeys.catalog.categories({ activeOnly });

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const where = activeOnly ? { is_active: true } : {};
        return await this.db.category.findMany({
          where,
          orderBy: [{ display_order: 'asc' }, { name: 'asc' }],
          include: { children: true },
        });
      },
      config.cache.categoryTtl,
    );
  }

  async invalidateCache(id = null, slug = null) {
    const promises = [
      this.cache.deleteByPattern(CacheKeys.catalog.categoryPattern()),
      this.cache.delete(CacheKeys.catalog.categoryTree()),
      // Invalidate products browse cache since category tree/names changed
      this.cache.deleteByPattern(CacheKeys.catalog.productsPattern()),
    ];
    if (id) {
      promises.push(this.cache.delete(CacheKeys.catalog.category(id)));
    }
    if (slug) {
      promises.push(this.cache.delete(`catalog:category:slug:${slug}`));
    }
    await Promise.all(promises);
  }

  async create(data) {
    const created = await this.db.category.create({
      data: {
        name: data.name.trim(),
        slug: data.slug.toLowerCase().trim(),
        description: data.description ? data.description.trim() : null,
        parent_id: data.parentId || null,
        image_url: data.imageUrl || null,
        is_active: data.isActive !== undefined ? data.isActive : true,
        display_order: data.displayOrder || 0,
      },
      include: { children: true, parent: true },
    });

    await this.invalidateCache(created.id, created.slug);
    return created;
  }

  async update(id, data) {
    const updated = await this.db.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.slug !== undefined && { slug: data.slug.toLowerCase().trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.parentId !== undefined && { parent_id: data.parentId }),
        ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
        ...(data.isActive !== undefined && { is_active: data.isActive }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
      },
      include: { children: true, parent: true },
    });

    await this.invalidateCache(id, updated.slug);
    return updated;
  }

  async delete(id) {
    const deleted = await this.db.category.delete({
      where: { id },
    });

    await this.invalidateCache(id, deleted?.slug);
    return deleted;
  }
}
