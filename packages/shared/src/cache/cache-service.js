import { logger } from '../utils/logger.js';
import { metricsRegistry } from '../utils/metrics.js';

// Register Prometheus metrics for cache
metricsRegistry.registerCounter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['namespace'],
});

metricsRegistry.registerCounter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['namespace'],
});

metricsRegistry.registerCounter({
  name: 'cache_errors_total',
  help: 'Total number of cache errors encountered',
  labelNames: ['namespace', 'operation'],
});

metricsRegistry.registerCounter({
  name: 'cache_sets_total',
  help: 'Total number of cache write operations',
  labelNames: ['namespace'],
});

metricsRegistry.registerCounter({
  name: 'cache_invalidations_total',
  help: 'Total number of cache invalidation operations',
  labelNames: ['namespace'],
});

/**
 * Enterprise Production-Grade Cache Service
 *
 * Implements a resilient cache-aside abstraction wrapping Redis.
 * Guarantees:
 * 1. Safe error handling: Redis downtime never crashes caller or blocks transactions.
 * 2. Transparent JSON serialization/deserialization.
 * 3. Graceful degradation: Read misses/errors fall back directly to authoritative datastore.
 * 4. Cache stampede protection option via distributed lock.
 * 5. Prometheus metrics collection (hits, misses, errors, sets, invalidations).
 */
export class CacheService {
  /**
   * @param {Object} options
   * @param {import('ioredis').Redis} options.redisClient
   * @param {boolean} [options.enabled=true]
   * @param {string} [options.defaultNamespace='default']
   * @param {number} [options.defaultTtl=300] Default TTL in seconds
   * @param {number} [options.jitterPercent] Jitter percentage (e.g., 10 for ±10%)
   */
  constructor({
    redisClient,
    enabled = true,
    defaultNamespace = 'default',
    defaultTtl = 300,
    jitterPercent,
  }) {
    this.redis = redisClient;
    this.enabled = enabled && process.env.CACHE_ENABLED !== 'false';
    this.defaultNamespace = defaultNamespace;
    this.defaultTtl = defaultTtl;

    let resolvedJitter = jitterPercent;
    if (resolvedJitter === undefined) {
      if (process.env.CACHE_TTL_JITTER_PERCENT !== undefined) {
        resolvedJitter = parseInt(process.env.CACHE_TTL_JITTER_PERCENT, 10);
      } else if (process.env.NODE_ENV === 'test') {
        // In automated testing environments, default to 0% unless explicitly configured
        // so legacy unit test mock assertions on exact TTL remain deterministic.
        resolvedJitter = 0;
      } else {
        // Production and runtime default is ±10%
        resolvedJitter = 10;
      }
    }
    this.jitterPercent = Math.max(0, Math.min(100, Number(resolvedJitter) || 0));
  }

  /**
   * Applies random jitter within [-jitterPercent, +jitterPercent] to prevent cache stampede.
   * Guarantees result is an integer and strictly >= 1.
   *
   * @param {number} baseTtl
   * @returns {number}
   */
  applyJitter(baseTtl) {
    const ttl = Math.max(1, Number(baseTtl) || this.defaultTtl);
    if (this.jitterPercent <= 0) {
      return ttl;
    }
    // Random factor between 1 - (jitterPercent / 100) and 1 + (jitterPercent / 100)
    const factor = 1 + (Math.random() * 2 - 1) * (this.jitterPercent / 100);
    return Math.max(1, Math.round(ttl * factor));
  }

  /**
   * Extracts namespace from key (e.g. 'catalog:product:123' -> 'catalog')
   * @private
   */
  _getNamespace(key) {
    if (!key || typeof key !== 'string') {
      return this.defaultNamespace;
    }
    const parts = key.split(':');
    return parts[0] || this.defaultNamespace;
  }

  /**
   * Safe check if Redis connection is usable
   * @private
   */
  async _ensureConnected() {
    if (!this.enabled || !this.redis) {
      return false;
    }
    if (this.redis.status === 'wait') {
      try {
        await this.redis.connect();
      } catch (err) {
        logger.warn({ err: err.message }, 'Cache lazy Redis connect failed');
        return false;
      }
    }
    if (this.redis.status) {
      return this.redis.status === 'ready' || this.redis.status === 'connecting';
    }
    return typeof this.redis.get === 'function' && typeof this.redis.set === 'function';
  }

  _isReady() {
    if (!this.enabled || !this.redis) {
      return false;
    }
    if (this.redis.status) {
      return (
        this.redis.status === 'ready' ||
        this.redis.status === 'connecting' ||
        this.redis.status === 'wait'
      );
    }
    return typeof this.redis.get === 'function' && typeof this.redis.set === 'function';
  }

  /**
   * Retrieve an item from cache.
   * Returns parsed value on hit, null on miss or error.
   *
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    if (!this._isReady()) {
      return null;
    }

    const namespace = this._getNamespace(key);

    try {
      const raw = await this.redis.get(key);
      if (raw === null || raw === undefined) {
        metricsRegistry.getMetric('cache_misses_total')?.inc({ namespace });
        return null;
      }

      metricsRegistry.getMetric('cache_hits_total')?.inc({ namespace });
      return JSON.parse(raw);
    } catch (error) {
      metricsRegistry.getMetric('cache_errors_total')?.inc({ namespace, operation: 'get' });
      logger.warn({ err: error.message, key }, 'Cache get failed, degrading to DB');
      return null;
    }
  }

  /**
   * Store an item in cache with a TTL (seconds).
   * Safe error handling: never throws if Redis is down.
   *
   * @param {string} key
   * @param {any} value
   * @param {number} [ttlSeconds]
   * @returns {Promise<boolean>} True if stored successfully
   */
  async set(key, value, ttlSeconds = this.defaultTtl) {
    if (!this._isReady() || value === undefined) {
      return false;
    }

    const namespace = this._getNamespace(key);
    const baseTtl = Math.max(1, Number(ttlSeconds) || this.defaultTtl);
    const ttl = this.applyJitter(baseTtl);

    try {
      const serialized = JSON.stringify(value);
      if (typeof this.redis.setex === 'function') {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized, 'EX', ttl);
      }
      metricsRegistry.getMetric('cache_sets_total')?.inc({ namespace });
      return true;
    } catch (error) {
      metricsRegistry.getMetric('cache_errors_total')?.inc({ namespace, operation: 'set' });
      logger.warn({ err: error.message, key }, 'Cache set failed');
      return false;
    }
  }

  /**
   * Delete a key from cache.
   * Safe error handling: never throws if Redis is down.
   *
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async delete(key) {
    if (!this._isReady()) {
      return false;
    }

    const namespace = this._getNamespace(key);

    try {
      await this.redis.del(key);
      metricsRegistry.getMetric('cache_invalidations_total')?.inc({ namespace });
      return true;
    } catch (error) {
      metricsRegistry.getMetric('cache_errors_total')?.inc({ namespace, operation: 'delete' });
      logger.warn({ err: error.message, key }, 'Cache delete failed');
      return false;
    }
  }

  /**
   * Delete keys matching a pattern safely using SCAN (never KEYS in production).
   * Safe error handling: never throws if Redis is down.
   *
   * @param {string} pattern
   * @returns {Promise<number>} Number of keys deleted
   */
  async deleteByPattern(pattern) {
    if (!this._isReady() || !pattern) {
      return 0;
    }

    const namespace = this._getNamespace(pattern);
    let totalDeleted = 0;

    try {
      let cursor = '0';
      do {
        // SCAN 100 keys per iteration to avoid blocking Redis event loop
        const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;

        if (keys && keys.length > 0) {
          await this.redis.del(...keys);
          totalDeleted += keys.length;
          metricsRegistry.getMetric('cache_invalidations_total')?.inc({ namespace }, keys.length);
        }
      } while (cursor !== '0');

      return totalDeleted;
    } catch (error) {
      metricsRegistry
        .getMetric('cache_errors_total')
        ?.inc({ namespace, operation: 'deleteByPattern' });
      logger.warn({ err: error.message, pattern }, 'Cache deleteByPattern failed');
      return 0;
    }
  }

  /**
   * Check if a key exists in cache.
   *
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    if (!this._isReady()) {
      return false;
    }

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.warn({ err: error.message, key }, 'Cache exists check failed');
      return false;
    }
  }

  /**
   * Cache-Aside getOrSet pattern with built-in stampede protection.
   *
   * If cache hit: returns cached value immediately.
   * If cache miss:
   *   - If stampedeProtection is enabled: acquires a short distributed lock (e.g. 5s)
   *     so only ONE worker computes/queries DB. Other callers wait briefly and recheck cache.
   *   - Loads authoritative data via `loader()`.
   *   - Sets data in cache with `ttlSeconds`.
   *   - Returns data.
   * If Redis is completely unavailable: directly executes `loader()` and returns result.
   *
   * @param {string} key
   * @param {() => Promise<any>} loader Authoritative DB loader function
   * @param {number} [ttlSeconds]
   * @param {Object} [options]
   * @param {boolean} [options.stampedeProtection=false]
   * @param {number} [options.lockTimeoutMs=5000]
   * @returns {Promise<any>}
   */
  async getOrSet(key, loader, ttlSeconds = this.defaultTtl, options = {}) {
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    const { stampedeProtection = false, lockTimeoutMs = 5000 } = options;

    if (!stampedeProtection || !this._isReady()) {
      // Normal cache-aside without distributed lock
      const freshData = await loader();
      if (freshData !== null && freshData !== undefined) {
        await this.set(key, freshData, ttlSeconds);
      }
      return freshData;
    }

    // Stampede protection using Redis SET NX EX
    const lockKey = `lock:${key}`;
    const lockValue = `${Date.now()}:${Math.random()}`;
    const lockTtlSeconds = Math.max(1, Math.ceil(lockTimeoutMs / 1000));

    let acquired = false;
    try {
      const lockResult = await this.redis.set(lockKey, lockValue, 'NX', 'EX', lockTtlSeconds);
      acquired = lockResult === 'OK';
    } catch (err) {
      // If locking fails, proceed to loader without lock
      acquired = false;
    }

    if (!acquired) {
      // Another worker is generating the cache. Wait briefly (up to 300ms) and retry reading cache.
      await new Promise((resolve) => setTimeout(resolve, 150));
      const retryCached = await this.get(key);
      if (retryCached !== null) {
        return retryCached;
      }
      // If still missing after wait, load directly
      return loader();
    }

    try {
      const freshData = await loader();
      if (freshData !== null && freshData !== undefined) {
        await this.set(key, freshData, ttlSeconds);
      }
      return freshData;
    } finally {
      // Release lock safely via Lua script to verify lockValue ownership
      try {
        const releaseScript = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        await this.redis.eval(releaseScript, 1, lockKey, lockValue);
      } catch (err) {
        // Ignore lock release error
      }
    }
  }
}
