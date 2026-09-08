import { getRedisClient, CacheService, CacheKeys } from '@ecommerce/shared';

import { prisma } from '../lib/prisma.js';
import { config } from '../config/index.js';

export class AddressRepository {
  constructor(db = prisma, cacheService = null) {
    this.db = db;
    if (cacheService) {
      this.cache = cacheService;
    } else {
      try {
        const redis = config.redisUrl ? getRedisClient(config.redisUrl) : null;
        this.cache = new CacheService({
          redisClient: redis,
          enabled: config.cache?.enabled !== false,
          defaultNamespace: 'identity',
          defaultTtl: config.cache?.userProfileTtl || 300,
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
    const cacheKey = CacheKeys.identity.address(id);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await this.db.address.findUnique({
          where: { id },
        });
      },
      config.cache?.userProfileTtl || 300,
    );
  }

  async findByUserId(userId) {
    if (!userId) {
      return [];
    }
    const cacheKey = CacheKeys.identity.userAddresses(userId);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await this.db.address.findMany({
          where: { user_id: userId },
          orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
        });
      },
      config.cache?.userProfileTtl || 300,
    );
  }

  async invalidateAddressCache(userId, addressId = null) {
    const promises = [this.cache.delete(CacheKeys.identity.userAddresses(userId))];
    if (addressId) {
      promises.push(this.cache.delete(CacheKeys.identity.address(addressId)));
    }
    await Promise.all(promises);
  }

  async create(userId, data) {
    const created = await this.db.$transaction(async (tx) => {
      // Check if user currently has any addresses
      const count = await tx.address.count({ where: { user_id: userId } });
      const shouldBeDefault = data.isDefault || count === 0;

      if (shouldBeDefault) {
        // Clear previous default
        await tx.address.updateMany({
          where: { user_id: userId, is_default: true },
          data: { is_default: false },
        });
      }

      return await tx.address.create({
        data: {
          user_id: userId,
          full_name: data.fullName,
          phone: data.phone,
          street_address: data.streetAddress,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          country: data.country || 'India',
          is_default: shouldBeDefault,
        },
      });
    });

    await this.invalidateAddressCache(userId, created.id);
    return created;
  }

  async update(id, userId, data) {
    const updated = await this.db.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { user_id: userId, is_default: true },
          data: { is_default: false },
        });
      }

      return await tx.address.update({
        where: { id },
        data: {
          ...(data.fullName !== undefined && { full_name: data.fullName }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.streetAddress !== undefined && { street_address: data.streetAddress }),
          ...(data.city !== undefined && { city: data.city }),
          ...(data.state !== undefined && { state: data.state }),
          ...(data.postalCode !== undefined && { postal_code: data.postalCode }),
          ...(data.country !== undefined && { country: data.country }),
          ...(data.isDefault !== undefined && { is_default: data.isDefault }),
        },
      });
    });

    await this.invalidateAddressCache(userId, id);
    return updated;
  }

  async delete(id, userId) {
    const result = await this.db.$transaction(async (tx) => {
      const address = await tx.address.findUnique({ where: { id } });
      if (!address || address.user_id !== userId) {
        return null;
      }

      const wasDefault = address.is_default;
      await tx.address.delete({ where: { id } });

      // If deleted address was default, promote a remaining address if any exists
      if (wasDefault) {
        const remaining = await tx.address.findFirst({
          where: { user_id: userId },
          orderBy: { created_at: 'desc' },
        });

        if (remaining) {
          await tx.address.update({
            where: { id: remaining.id },
            data: { is_default: true },
          });
        }
      }

      return address;
    });

    if (result) {
      await this.invalidateAddressCache(userId, id);
    }
    return result;
  }
}
