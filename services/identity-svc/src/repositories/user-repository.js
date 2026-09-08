import { getRedisClient, CacheService, CacheKeys } from '@ecommerce/shared';

import { prisma } from '../lib/prisma.js';
import { config } from '../config/index.js';

export class UserRepository {
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
    const cacheKey = CacheKeys.identity.user(id);

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        return await this.db.user.findUnique({
          where: { id },
          include: { seller: true },
        });
      },
      config.cache?.userProfileTtl || 300,
    );
  }

  async findByEmail(email) {
    if (!email) {
      return null;
    }
    const normalized = email.toLowerCase().trim();
    const cacheKey = `identity:user:email:${normalized}`;

    return await this.cache.getOrSet(
      cacheKey,
      async () => {
        const user = await this.db.user.findUnique({
          where: { email: normalized },
          include: { seller: true },
        });
        if (user) {
          // Warm the by-id cache as well
          await this.cache.set(
            CacheKeys.identity.user(user.id),
            user,
            config.cache?.userProfileTtl || 300,
          );
        }
        return user;
      },
      config.cache?.userProfileTtl || 300,
    );
  }

  async invalidateCache(id, email = null) {
    const promises = [this.cache.delete(CacheKeys.identity.user(id))];
    if (email) {
      promises.push(this.cache.delete(`identity:user:email:${email.toLowerCase().trim()}`));
    }
    await Promise.all(promises);
  }

  async create(data) {
    return await this.db.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        phone: data.phone || null,
        password_hash: data.passwordHash,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role || 'CUSTOMER',
        is_verified: data.isVerified || false,
      },
    });
  }

  async update(id, data) {
    const updated = await this.db.user.update({
      where: { id },
      data,
    });
    await this.invalidateCache(id, updated.email);
    return updated;
  }

  async setVerified(id, isVerified = true) {
    const updated = await this.db.user.update({
      where: { id },
      data: { is_verified: isVerified },
    });
    await this.invalidateCache(id, updated.email);
    return updated;
  }

  async updatePassword(id, passwordHash) {
    const updated = await this.db.user.update({
      where: { id },
      data: { password_hash: passwordHash },
    });
    await this.invalidateCache(id, updated.email);
    return updated;
  }
}
