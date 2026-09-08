import { mapConcurrent } from '../../src/utils/concurrency.js';
import { configureDatabaseUrl } from '../../src/utils/db-pool.js';

describe('Shared Concurrency & DB Pool Utilities Unit Tests', () => {
  describe('mapConcurrent (Bounded Concurrency)', () => {
    test('returns empty array when input is empty or invalid', async () => {
      expect(await mapConcurrent([], async (x) => x)).toEqual([]);
      expect(await mapConcurrent(null, async (x) => x)).toEqual([]);
    });

    test('preserves order of results while running concurrently', async () => {
      const items = [10, 20, 30, 40, 50];
      const results = await mapConcurrent(
        items,
        async (val) => {
          return val * 2;
        },
        2,
      );
      expect(results).toEqual([20, 40, 60, 80, 100]);
    });

    test('strictly enforces concurrency ceiling', async () => {
      let activeWorkers = 0;
      let maxObservedActive = 0;
      const items = [1, 2, 3, 4, 5, 6, 7, 8];
      const concurrencyLimit = 3;

      await mapConcurrent(
        items,
        async (item) => {
          activeWorkers++;
          maxObservedActive = Math.max(maxObservedActive, activeWorkers);
          await new Promise((resolve) => setTimeout(resolve, 20));
          activeWorkers--;
          return item;
        },
        concurrencyLimit,
      );

      expect(maxObservedActive).toBeLessThanOrEqual(concurrencyLimit);
    });
  });

  describe('configureDatabaseUrl (Connection Pooling Tuning)', () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    test('appends default connection_limit and pool_timeout when not present in URL', () => {
      const base = 'postgresql://user:pass@localhost:5432/order_db?schema=public';
      const tuned = configureDatabaseUrl(base, { serviceName: 'order-svc', defaultPoolSize: 10, defaultTimeout: 30 });
      const url = new URL(tuned);

      expect(url.searchParams.get('connection_limit')).toBe('10');
      expect(url.searchParams.get('pool_timeout')).toBe('30');
      expect(url.searchParams.get('schema')).toBe('public');
    });

    test('preserves existing URL parameters when no environment variable is set', () => {
      const base = 'postgresql://user:pass@localhost:5432/order_db?connection_limit=15&pool_timeout=45';
      const tuned = configureDatabaseUrl(base, { serviceName: 'order-svc', defaultPoolSize: 10, defaultTimeout: 30 });
      const url = new URL(tuned);

      expect(url.searchParams.get('connection_limit')).toBe('15');
      expect(url.searchParams.get('pool_timeout')).toBe('45');
    });

    test('overrides with DATABASE_POOL_SIZE and DATABASE_POOL_TIMEOUT environment variables', () => {
      process.env.DATABASE_POOL_SIZE = '25';
      process.env.DATABASE_POOL_TIMEOUT = '60';

      const base = 'postgresql://user:pass@localhost:5432/order_db?connection_limit=15';
      const tuned = configureDatabaseUrl(base, { serviceName: 'order-svc', defaultPoolSize: 10, defaultTimeout: 30 });
      const url = new URL(tuned);

      expect(url.searchParams.get('connection_limit')).toBe('25');
      expect(url.searchParams.get('pool_timeout')).toBe('60');
    });

    test('respects service-specific environment variable override', () => {
      process.env.CATALOG_SVC_DATABASE_POOL_SIZE = '12';
      process.env.DATABASE_POOL_SIZE = '20';

      const base = 'postgresql://user:pass@localhost:5432/catalog_db';
      const tuned = configureDatabaseUrl(base, { serviceName: 'catalog-svc', defaultPoolSize: 10 });
      const url = new URL(tuned);

      expect(url.searchParams.get('connection_limit')).toBe('12');
    });
  });
});
