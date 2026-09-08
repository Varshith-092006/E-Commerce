import { jest } from '@jest/globals';
import { CacheService } from '../../src/cache/cache-service.js';
import { CacheKeys } from '../../src/cache/cache-keys.js';
import { metricsRegistry } from '../../src/utils/metrics.js';

describe('Phase 1 & 2: Production-Grade CacheService & CacheKeys Unit Tests', () => {
  let mockRedis;
  let cacheService;

  beforeEach(() => {
    jest.clearAllMocks();
    metricsRegistry.reset();

    mockRedis = {
      status: 'ready',
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
      scan: jest.fn(),
      eval: jest.fn(),
    };

    cacheService = new CacheService({
      redisClient: mockRedis,
      enabled: true,
      defaultNamespace: 'test',
      defaultTtl: 300,
    });
  });

  describe('1. Cache Hit', () => {
    it('returns parsed cached value and increments cache_hits_total metric', async () => {
      const data = { id: 'p1', title: 'Running Shoes', price: 99.99 };
      mockRedis.get.mockResolvedValue(JSON.stringify(data));

      const result = await cacheService.get('catalog:product:p1');

      expect(result).toEqual(data);
      expect(mockRedis.get).toHaveBeenCalledWith('catalog:product:p1');
      const hitCounter = metricsRegistry.getMetric('cache_hits_total');
      expect(hitCounter.values.get('namespace="catalog"')).toBe(1);
    });
  });

  describe('2. Cache Miss', () => {
    it('returns null on miss and increments cache_misses_total metric', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.get('catalog:product:p2');

      expect(result).toBeNull();
      const missCounter = metricsRegistry.getMetric('cache_misses_total');
      expect(missCounter.values.get('namespace="catalog"')).toBe(1);
    });
  });

  describe('3. DB Fallback & getOrSet', () => {
    it('loads fresh data from DB loader on miss and populates cache with correct TTL', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue('OK');
      const dbLoader = jest.fn().mockResolvedValue({ id: 'p3', title: 'Laptop' });

      const result = await cacheService.getOrSet('catalog:product:p3', dbLoader, 600);

      expect(result).toEqual({ id: 'p3', title: 'Laptop' });
      expect(dbLoader).toHaveBeenCalledTimes(1);
      expect(mockRedis.set).toHaveBeenCalledWith(
        'catalog:product:p3',
        JSON.stringify({ id: 'p3', title: 'Laptop' }),
        'EX',
        expect.any(Number),
      );
      const setCall = mockRedis.set.mock.calls[0];
      expect(setCall[3]).toBeGreaterThanOrEqual(540);
      expect(setCall[3]).toBeLessThanOrEqual(660);
    });

    it('returns cached data without calling loader on cache hit', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 'p3', title: 'Laptop' }));
      const dbLoader = jest.fn();

      const result = await cacheService.getOrSet('catalog:product:p3', dbLoader, 600);

      expect(result).toEqual({ id: 'p3', title: 'Laptop' });
      expect(dbLoader).not.toHaveBeenCalled();
    });
  });

  describe('4. Cache Write (set)', () => {
    it('serializes JSON and writes with expiry', async () => {
      mockRedis.set.mockResolvedValue('OK');
      const ok = await cacheService.set('catalog:product:p4', { name: 'Item' }, 120);

      expect(ok).toBe(true);
      expect(mockRedis.set).toHaveBeenCalledWith(
        'catalog:product:p4',
        JSON.stringify({ name: 'Item' }),
        'EX',
        expect.any(Number),
      );
      const setCall = mockRedis.set.mock.calls[0];
      expect(setCall[3]).toBeGreaterThanOrEqual(108);
      expect(setCall[3]).toBeLessThanOrEqual(132);
    });
  });

  describe('5. Cache Invalidation (delete & deleteByPattern)', () => {
    it('deletes single key successfully', async () => {
      mockRedis.del.mockResolvedValue(1);
      const ok = await cacheService.delete('catalog:product:p5');

      expect(ok).toBe(true);
      expect(mockRedis.del).toHaveBeenCalledWith('catalog:product:p5');
    });

    it('safely scans and deletes matching keys without blocking Redis', async () => {
      mockRedis.scan
        .mockResolvedValueOnce(['10', ['catalog:products:hash1', 'catalog:products:hash2']])
        .mockResolvedValueOnce(['0', ['catalog:products:hash3']]);
      mockRedis.del.mockResolvedValue(2);

      const count = await cacheService.deleteByPattern('catalog:products:*');

      expect(count).toBe(3);
      expect(mockRedis.scan).toHaveBeenCalledTimes(2);
      expect(mockRedis.del).toHaveBeenCalledTimes(2);
    });
  });

  describe('6. Redis Unavailable / Safe Error Handling', () => {
    it('gracefully degrades to null when redis.get throws without throwing unhandled error', async () => {
      mockRedis.get.mockRejectedValue(new Error('Connection lost'));

      const result = await cacheService.get('catalog:product:p6');

      expect(result).toBeNull();
      const errorMetric = metricsRegistry.getMetric('cache_errors_total');
      expect(errorMetric.values.get('namespace="catalog",operation="get"')).toBe(1);
    });

    it('gracefully loads from DB when Redis throws during getOrSet', async () => {
      mockRedis.get.mockRejectedValue(new Error('Connection lost'));
      mockRedis.set.mockRejectedValue(new Error('Connection lost'));
      const dbLoader = jest.fn().mockResolvedValue({ id: 'p6', fromDb: true });

      const result = await cacheService.getOrSet('catalog:product:p6', dbLoader, 300);

      expect(result).toEqual({ id: 'p6', fromDb: true });
      expect(dbLoader).toHaveBeenCalledTimes(1);
    });
  });

  describe('7. Cache Stampede Protection', () => {
    it('acquires lock, queries DB, populates cache, and releases lock', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue('OK');
      mockRedis.eval.mockResolvedValue(1);

      const dbLoader = jest.fn().mockResolvedValue({ stats: 'computed' });

      const result = await cacheService.getOrSet('seller:analytics:overview:s1:all:all', dbLoader, 180, {
        stampedeProtection: true,
        lockTimeoutMs: 3000,
      });

      expect(result).toEqual({ stats: 'computed' });
      expect(dbLoader).toHaveBeenCalledTimes(1);
      expect(mockRedis.set).toHaveBeenCalledWith(
        'lock:seller:analytics:overview:s1:all:all',
        expect.any(String),
        'NX',
        'EX',
        3,
      );
      expect(mockRedis.eval).toHaveBeenCalledTimes(1);
    });
  });

  describe('8. Centralized CacheKeys Builders & Tenant/User Isolation', () => {
    it('generates isolated, scoped keys for sellers, users, products, and admin', () => {
      const seller1Key = CacheKeys.seller.analyticsOverview('seller-123', '2026-01-01', '2026-01-31');
      const seller2Key = CacheKeys.seller.analyticsOverview('seller-456', '2026-01-01', '2026-01-31');

      expect(seller1Key).not.toEqual(seller2Key);
      expect(seller1Key).toBe('seller:analytics:overview:seller-123:2026-01-01:2026-01-31');

      const userProfileKey = CacheKeys.identity.user('user-abc');
      expect(userProfileKey).toBe('identity:user:user-abc');

      const cartKey = CacheKeys.cart.user('user-abc');
      expect(cartKey).toBe('cart:user-abc');

      const adminStatsKey = CacheKeys.admin.dashboardStats();
      expect(adminStatsKey).toBe('admin:dashboard:stats');

      const reviewKey = CacheKeys.catalog.reviews('prod-999', 1, 10);
      expect(reviewKey).toBe('review:list:prod-999:1:10');
    });
  });

  describe('9. Configurable TTL Jitter (Phase 1 Hardening)', () => {
    afterEach(() => {
      delete process.env.CACHE_TTL_JITTER_PERCENT;
    });

    it('proves base TTL is preserved and used as center point with ±10% jitter', () => {
      const jitterService = new CacheService({ redisClient: mockRedis, jitterPercent: 10 });
      const baseTtl = 300;
      const samples = [];
      for (let i = 0; i < 200; i++) {
        samples.push(jitterService.applyJitter(baseTtl));
      }
      const sum = samples.reduce((acc, val) => acc + val, 0);
      const mean = sum / samples.length;
      // Mean should be centered close to base TTL (within 2%)
      expect(mean).toBeGreaterThanOrEqual(294);
      expect(mean).toBeLessThanOrEqual(306);
    });

    it('proves min TTL bound: lowest jittered TTL is strictly >= baseTtl * 0.90', () => {
      const jitterService = new CacheService({ redisClient: mockRedis, jitterPercent: 10 });
      const baseTtl = 300;
      const minExpected = 270;
      for (let i = 0; i < 200; i++) {
        const jittered = jitterService.applyJitter(baseTtl);
        expect(jittered).toBeGreaterThanOrEqual(minExpected);
      }
    });

    it('proves max TTL bound: highest jittered TTL is strictly <= baseTtl * 1.10', () => {
      const jitterService = new CacheService({ redisClient: mockRedis, jitterPercent: 10 });
      const baseTtl = 300;
      const maxExpected = 330;
      for (let i = 0; i < 200; i++) {
        const jittered = jitterService.applyJitter(baseTtl);
        expect(jittered).toBeLessThanOrEqual(maxExpected);
      }
    });

    it('proves randomization across runs with high entropy', () => {
      const jitterService = new CacheService({ redisClient: mockRedis, jitterPercent: 10 });
      const baseTtl = 300;
      const uniqueValues = new Set();
      for (let i = 0; i < 100; i++) {
        uniqueValues.add(jitterService.applyJitter(baseTtl));
      }
      // With 61 possible discrete integer values between 270 and 330, 100 samples should produce >= 25 distinct values
      expect(uniqueValues.size).toBeGreaterThan(20);
    });

    it('proves TTL remains strictly positive (never <= 0) even with zero or negative base TTL', () => {
      const jitterService = new CacheService({ redisClient: mockRedis, jitterPercent: 10 });
      expect(jitterService.applyJitter(0)).toBeGreaterThanOrEqual(1);
      expect(jitterService.applyJitter(-50)).toBeGreaterThanOrEqual(1);
      expect(jitterService.applyJitter(1)).toBeGreaterThanOrEqual(1);
    });

    it('proves jitter is configurable via CACHE_TTL_JITTER_PERCENT environment variable', () => {
      process.env.CACHE_TTL_JITTER_PERCENT = '25';
      const envService = new CacheService({ redisClient: mockRedis });
      expect(envService.jitterPercent).toBe(25);

      for (let i = 0; i < 50; i++) {
        const jittered = envService.applyJitter(100);
        expect(jittered).toBeGreaterThanOrEqual(75);
        expect(jittered).toBeLessThanOrEqual(125);
      }
    });

    it('passes jittered TTL to Redis set command when jitter is enabled', async () => {
      const jitterService = new CacheService({ redisClient: mockRedis, jitterPercent: 10 });
      mockRedis.set.mockResolvedValue('OK');
      await jitterService.set('catalog:product:p9', { name: 'JitterTest' }, 300);

      expect(mockRedis.set).toHaveBeenCalledWith(
        'catalog:product:p9',
        JSON.stringify({ name: 'JitterTest' }),
        'EX',
        expect.any(Number),
      );

      const callArgs = mockRedis.set.mock.calls[0];
      const actualTtl = callArgs[3];
      expect(actualTtl).toBeGreaterThanOrEqual(270);
      expect(actualTtl).toBeLessThanOrEqual(330);
    });
  });
});
