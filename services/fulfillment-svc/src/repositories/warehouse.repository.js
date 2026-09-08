import { getRedisClient, CacheService, CacheKeys } from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';
import { config } from '../config/index.js';

export class WarehouseRepository {
  constructor(prismaClient = defaultPrisma, cacheService = null) {
    this.prisma = prismaClient;
    if (cacheService) {
      this.cache = cacheService;
    } else {
      try {
        const redis = config.redisUrl ? getRedisClient(config.redisUrl) : null;
        this.cache = new CacheService({
          redisClient: redis,
          enabled: config.cache?.enabled !== false,
          defaultNamespace: 'warehouse',
          defaultTtl: config.cache?.warehouseTtl || 900,
        });
      } catch {
        this.cache = new CacheService({ redisClient: null, enabled: false });
      }
    }
  }

  async invalidateWarehouseCache(id = null) {
    const promises = [this.cache.deleteByPattern(CacheKeys.fulfillment.warehousesPattern())];
    if (id) {
      promises.push(this.cache.delete(CacheKeys.fulfillment.warehouse(id)));
    }
    await Promise.all(promises);
  }

  /**
   * Creates a new warehouse
   */
  async createWarehouse(
    {
      code,
      name,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country = 'IN',
      is_active = true,
    },
    tx = this.prisma,
  ) {
    const warehouse = await tx.warehouse.create({
      data: {
        code,
        name,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_active,
      },
    });

    await this.invalidateWarehouseCache(warehouse.id);
    return warehouse;
  }

  /**
   * Updates an existing warehouse by ID
   */
  async updateWarehouse(id, data, tx = this.prisma) {
    const updated = await tx.warehouse.update({
      where: { id },
      data,
    });

    await this.invalidateWarehouseCache(id);
    return updated;
  }

  /**
   * Finds a warehouse by ID
   */
  async findById(id, tx = this.prisma) {
    if (!id) {
      return null;
    }
    const cacheKey = CacheKeys.fulfillment.warehouse(id);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await tx.warehouse.findUnique({
          where: { id },
        });
      },
      config.cache?.warehouseTtl || 900,
    );
  }

  /**
   * Finds a warehouse by code
   */
  async findByCode(code, tx = this.prisma) {
    return await tx.warehouse.findUnique({
      where: { code },
    });
  }

  /**
   * Finds warehouses by filter with pagination
   */
  async findMany(
    { is_active, postal_code, city, state, skip = 0, take = 50 } = {},
    tx = this.prisma,
  ) {
    const queryParams = { is_active, postal_code, city, state, skip, take };
    const cacheKey = CacheKeys.fulfillment.warehousesList(queryParams);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const where = {};
        if (typeof is_active === 'boolean') {
          where.is_active = is_active;
        }
        if (postal_code) {
          where.postal_code = postal_code;
        }
        if (city) {
          where.city = city;
        }
        if (state) {
          where.state = state;
        }

        const [items, total] = await Promise.all([
          tx.warehouse.findMany({
            where,
            orderBy: { code: 'asc' },
            skip,
            take,
          }),
          tx.warehouse.count({ where }),
        ]);

        return { items, total };
      },
      config.cache?.warehouseTtl || 900,
    );
  }
}

export const warehouseRepository = new WarehouseRepository();
