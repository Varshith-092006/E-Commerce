import http from 'http';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

import {
  Bulkhead,
  calculateRetryDelayWithJitter,
  mapConcurrent,
  GracefulShutdownHandler,
  createServiceHealthRouter,
  defaultHttpAgent,
  defaultHttpsAgent,
  fetchWithTimeout,
  ServiceUnavailableError,
} from '../../src/index.js';

describe('Phase 2: Resilience & Concurrency Hardening', () => {
  describe('Phase 2A: Backpressure & Bounded Concurrency (mapConcurrent)', () => {
    it('processes items with bounded maximum concurrency', async () => {
      let activeCount = 0;
      let maxObservedActive = 0;

      const items = Array.from({ length: 20 }, (_, i) => i);
      const concurrencyLimit = 4;

      const results = await mapConcurrent(
        items,
        async (item) => {
          activeCount++;
          maxObservedActive = Math.max(maxObservedActive, activeCount);
          await new Promise((resolve) => setTimeout(resolve, 20));
          activeCount--;
          return item * 2;
        },
        concurrencyLimit,
      );

      expect(maxObservedActive).toBeLessThanOrEqual(concurrencyLimit);
      expect(results).toHaveLength(20);
      expect(results[0]).toBe(0);
      expect(results[19]).toBe(38);
    });

    it('handles empty or non-array collections gracefully', async () => {
      expect(await mapConcurrent([], async () => 1)).toEqual([]);
      expect(await mapConcurrent(null, async () => 1)).toEqual([]);
    });
  });

  describe('Phase 2B & 2C: Bulkhead Pattern & Queue Limits', () => {
    let bulkhead;

    beforeEach(() => {
      bulkhead = new Bulkhead({
        name: 'test-workload',
        maxConcurrent: 2,
        maxQueue: 2,
        timeoutMs: 500,
      });
    });

    it('allows concurrent requests up to maxConcurrent without queuing', async () => {
      const activeStates = [];

      const p1 = bulkhead.execute(async () => {
        activeStates.push(bulkhead.getMetrics().active);
        await new Promise((resolve) => setTimeout(resolve, 30));
        return 'res1';
      });

      const p2 = bulkhead.execute(async () => {
        activeStates.push(bulkhead.getMetrics().active);
        await new Promise((resolve) => setTimeout(resolve, 30));
        return 'res2';
      });

      const [r1, r2] = await Promise.all([p1, p2]);
      expect(r1).toBe('res1');
      expect(r2).toBe('res2');
      expect(activeStates).toEqual([1, 2]);
    });

    it('queues excess tasks when active slots are full', async () => {
      const executed = [];

      const p1 = bulkhead.execute(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        executed.push(1);
      });
      const p2 = bulkhead.execute(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        executed.push(2);
      });
      const p3 = bulkhead.execute(async () => {
        executed.push(3);
      });

      expect(bulkhead.getMetrics().active).toBe(2);
      expect(bulkhead.getMetrics().queued).toBe(1);

      await Promise.all([p1, p2, p3]);
      expect(executed.sort()).toEqual([1, 2, 3]);
      expect(bulkhead.getMetrics().active).toBe(0);
      expect(bulkhead.getMetrics().queued).toBe(0);
    });

    it('rejects tasks with ServiceUnavailableError when queue capacity is exceeded', async () => {
      const longTask = () => new Promise((resolve) => setTimeout(resolve, 100));

      // Fill active (2)
      bulkhead.execute(longTask);
      bulkhead.execute(longTask);

      // Fill queue (2)
      bulkhead.execute(longTask);
      bulkhead.execute(longTask);

      // 5th task must be rejected immediately with ServiceUnavailableError
      await expect(bulkhead.execute(longTask)).rejects.toThrow(ServiceUnavailableError);
    });

    it('times out queued tasks that wait longer than timeoutMs', async () => {
      const longBulkhead = new Bulkhead({
        name: 'timeout-workload',
        maxConcurrent: 1,
        maxQueue: 2,
        timeoutMs: 30,
      });

      const blockingTask = longBulkhead.execute(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const timedOutTask = longBulkhead.execute(async () => 'fast');

      await expect(timedOutTask).rejects.toThrow(ServiceUnavailableError);
      await blockingTask;
    });

    it('isolates workloads: saturated bulkhead does not starve other bulkhead', async () => {
      const paymentBulkhead = new Bulkhead({ name: 'payment', maxConcurrent: 1, maxQueue: 0 });
      const notificationBulkhead = new Bulkhead({
        name: 'notification',
        maxConcurrent: 2,
        maxQueue: 5,
      });

      // Saturate payment bulkhead
      const paymentJob = paymentBulkhead.execute(
        () => new Promise((resolve) => setTimeout(resolve, 80)),
      );

      // Payment is full
      await expect(paymentBulkhead.execute(async () => 'overflow')).rejects.toThrow(
        ServiceUnavailableError,
      );

      // Notification workload remains available and completes successfully!
      const notifJob = await notificationBulkhead.execute(async () => 'notification-sent');
      expect(notifJob).toBe('notification-sent');

      await paymentJob;
    });
  });

  describe('Phase 2D: Retry Jitter', () => {
    const originalEnv = process.env.RETRY_JITTER_PERCENT;

    afterEach(() => {
      process.env.RETRY_JITTER_PERCENT = originalEnv;
    });

    it('calculates exponential delay with bounded random jitter within jitterPercent', () => {
      process.env.RETRY_JITTER_PERCENT = '20';

      const baseDelay = 1000;
      // Attempt 1: 1000ms base. 20% jitter -> range [800, 1200]
      for (let i = 0; i < 20; i++) {
        const delay = calculateRetryDelayWithJitter({
          attempt: 1,
          baseDelayMs: baseDelay,
          maxDelayMs: 30000,
        });
        expect(delay).toBeGreaterThanOrEqual(800);
        expect(delay).toBeLessThanOrEqual(1200);
      }

      // Attempt 2: 2000ms base. 20% jitter -> range [1600, 2400]
      for (let i = 0; i < 20; i++) {
        const delay = calculateRetryDelayWithJitter({
          attempt: 2,
          baseDelayMs: baseDelay,
          maxDelayMs: 30000,
        });
        expect(delay).toBeGreaterThanOrEqual(1600);
        expect(delay).toBeLessThanOrEqual(2400);
      }
    });

    it('respects zero jitter (deterministic exponential delay)', () => {
      const delay = calculateRetryDelayWithJitter({
        attempt: 3,
        baseDelayMs: 1000,
        jitterPercent: 0,
      });
      // 1000 * 2^(3-1) = 4000
      expect(delay).toBe(4000);
    });

    it('never exceeds maxDelayMs even with positive jitter', () => {
      const maxDelay = 5000;
      for (let attempt = 1; attempt <= 10; attempt++) {
        const delay = calculateRetryDelayWithJitter({
          attempt,
          baseDelayMs: 1000,
          maxDelayMs: maxDelay,
          jitterPercent: 50,
        });
        expect(delay).toBeLessThanOrEqual(maxDelay);
        expect(delay).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Phase 2E: Graceful Shutdown', () => {
    it('executes teardown sequence across server, workers, consumers, redis, and prisma', async () => {
      const steps = [];

      const mockServer = {
        close: jest.fn((cb) => {
          steps.push('server_closed');
          cb();
        }),
      };

      const mockWorker = {
        stop: jest.fn(async () => {
          steps.push('worker_stopped');
        }),
      };

      const mockConsumer = {
        stop: jest.fn(async () => {
          steps.push('consumer_stopped');
        }),
      };

      const mockProducer = {
        disconnect: jest.fn(async () => {
          steps.push('producer_disconnected');
        }),
      };

      const mockRedis = {
        quit: jest.fn(async () => {
          steps.push('redis_closed');
        }),
      };

      const mockPrisma = {
        $disconnect: jest.fn(async () => {
          steps.push('prisma_closed');
        }),
      };

      const shutdownHandler = new GracefulShutdownHandler({
        server: mockServer,
        serviceName: 'test-service',
        shutdownTimeoutMs: 5000,
        workers: [mockWorker],
        consumers: [mockConsumer],
        producers: [mockProducer],
        redis: mockRedis,
        prisma: mockPrisma,
      });

      expect(shutdownHandler.getIsShuttingDown()).toBe(false);

      await shutdownHandler.shutdown('SIGTERM');

      expect(shutdownHandler.getIsShuttingDown()).toBe(true);
      expect(steps).toEqual([
        'server_closed',
        'worker_stopped',
        'consumer_stopped',
        'producer_disconnected',
        'redis_closed',
        'prisma_closed',
      ]);
    });
  });

  describe('Phase 2F: Readiness / Liveness Probes', () => {
    it('Liveness returns 200 UP even when database or redis is unreachable', async () => {
      const app = express();
      app.use(
        createServiceHealthRouter({
          serviceName: 'order-svc',
          checkLiveness: () => true,
          checkReadiness: async () => ({ db: 'failed', redis: 'failed' }),
        }),
      );

      const res = await request(app).get('/liveness');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
      expect(res.body.alive).toBe(true);
      expect(res.body.service).toBe('order-svc');
    });

    it('Readiness returns 200 READY when all dependencies are healthy', async () => {
      const app = express();
      app.use(
        createServiceHealthRouter({
          serviceName: 'catalog-svc',
          checkReadiness: async () => ({ db: 'ok', redis: 'connected' }),
        }),
      );

      const res = await request(app).get('/ready');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('READY');
      expect(res.body.ready).toBe(true);
      expect(res.body.checks.db).toBe('ok');
    });

    it('Readiness returns 503 NOT_READY when any required dependency fails', async () => {
      const app = express();
      app.use(
        createServiceHealthRouter({
          serviceName: 'payment-svc',
          checkReadiness: async () => ({ db: 'ok', redis: 'failed' }),
        }),
      );

      const res = await request(app).get('/ready');
      expect(res.status).toBe(503);
      expect(res.body.status).toBe('NOT_READY');
      expect(res.body.ready).toBe(false);
      expect(res.body.checks.redis).toBe('failed');
    });

    it('Readiness returns 503 SHUTTING_DOWN immediately during graceful shutdown', async () => {
      let isShuttingDown = false;
      const app = express();
      app.use(
        createServiceHealthRouter({
          serviceName: 'gateway',
          getIsShuttingDown: () => isShuttingDown,
          checkReadiness: async () => ({ redis: 'ok' }),
        }),
      );

      // Normal state: ready
      const r1 = await request(app).get('/ready');
      expect(r1.status).toBe(200);

      // Shutdown signal triggered
      isShuttingDown = true;
      const r2 = await request(app).get('/ready');
      expect(r2.status).toBe(503);
      expect(r2.body.status).toBe('SHUTTING_DOWN');
      expect(r2.body.ready).toBe(false);
    });
  });

  describe('Phase 2G: HTTP Connection Management', () => {
    it('exports configured HTTP and HTTPS agents with keep-alive and socket pooling', () => {
      expect(defaultHttpAgent).toBeInstanceOf(http.Agent);
      expect(defaultHttpAgent.keepAlive).toBe(true);
      expect(defaultHttpAgent.maxSockets).toBeGreaterThanOrEqual(50);

      expect(defaultHttpsAgent.keepAlive).toBe(true);
      expect(defaultHttpsAgent.maxSockets).toBeGreaterThanOrEqual(50);
    });

    it('fetchWithTimeout aborts and throws TimeoutError when request exceeds timeoutMs', async () => {
      // Mock slow server
      const slowServer = http.createServer((req, res) => {
        setTimeout(() => {
          res.writeHead(200);
          res.end('ok');
        }, 150);
      });

      await new Promise((resolve) => slowServer.listen(0, resolve));
      const port = slowServer.address().port;

      try {
        await expect(
          fetchWithTimeout(`http://127.0.0.1:${port}/slow`, {}, 50),
        ).rejects.toThrow(/timed out/i);
      } finally {
        await new Promise((resolve) => slowServer.close(resolve));
      }
    });
  });
});
