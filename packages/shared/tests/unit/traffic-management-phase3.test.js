import http from 'http';
import express from 'express';
import request from 'supertest';
import zlib from 'zlib';
import { describe, it, expect, beforeEach } from '@jest/globals';

import {
  createLoadSheddingMiddleware,
  getLoadSheddingMetrics,
  resetLoadSheddingMetrics,
  classifyRequestPriority,
  createCompressionMiddleware,
  createRequestLimitsMiddleware,
  createUriLengthCheck,
} from '../../src/index.js';

// Helper to make raw HTTP requests without Superagent's auto-decompression
function rawHttpRequest({ app, method = 'GET', path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const req = http.request(
        {
          host: '127.0.0.1',
          port,
          method,
          path,
          headers,
        },
        (res) => {
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            server.close(() => {
              resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: Buffer.concat(chunks),
              });
            });
          });
        },
      );

      req.on('error', (err) => {
        server.close(() => reject(err));
      });

      if (body) {
        req.write(body);
      }
      req.end();
    });
  });
}

describe('Phase 3: Traffic Management & API Protection', () => {
  describe('Phase 3A & 3C & 3D: Load Shedding & Workload Priority', () => {
    beforeEach(() => {
      resetLoadSheddingMetrics();
    });

    it('correctly classifies request priorities into CRITICAL, IMPORTANT, and LOWER_PRIORITY', () => {
      // CRITICAL
      expect(classifyRequestPriority('/api/v1/payments')).toBe('CRITICAL');
      expect(classifyRequestPriority('/api/v1/payments/order-123/capture')).toBe('CRITICAL');
      expect(classifyRequestPriority('/api/v1/refunds')).toBe('CRITICAL');
      expect(classifyRequestPriority('/api/v1/orders')).toBe('CRITICAL');
      expect(classifyRequestPriority('/api/v1/reservations')).toBe('CRITICAL');

      // IMPORTANT
      expect(classifyRequestPriority('/api/v1/products')).toBe('IMPORTANT');
      expect(classifyRequestPriority('/api/v1/products/search?q=test')).toBe('IMPORTANT');
      expect(classifyRequestPriority('/api/v1/categories')).toBe('IMPORTANT');
      expect(classifyRequestPriority('/api/v1/checkout')).toBe('IMPORTANT');
      expect(classifyRequestPriority('/api/v1/shipments')).toBe('IMPORTANT');
      expect(classifyRequestPriority('/api/v1/warehouses')).toBe('IMPORTANT');
      expect(classifyRequestPriority('/api/v1/fulfillment')).toBe('IMPORTANT');

      // LOWER_PRIORITY
      expect(classifyRequestPriority('/api/v1/seller/analytics')).toBe('LOWER_PRIORITY');
      expect(classifyRequestPriority('/api/v1/admin/dashboard')).toBe('LOWER_PRIORITY');
      expect(classifyRequestPriority('/api/v1/notifications')).toBe('LOWER_PRIORITY');
    });

    it('bypasses load shedding when disabled via options or environment', async () => {
      const app = express();
      app.use(createLoadSheddingMiddleware({ enabled: false, maxInflight: 1 }));
      app.get('/api/v1/notifications', (req, res) => res.json({ ok: true }));

      const res = await request(app).get('/api/v1/notifications');
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
    });

    it('bypasses health, readiness, and liveness probes regardless of in-flight load', async () => {
      const app = express();
      app.use(createLoadSheddingMiddleware({ maxInflight: 1, lowerPriorityThresholdPercent: 0 }));
      app.get('/health', (req, res) => res.json({ status: 'UP' }));
      app.get('/ready', (req, res) => res.json({ status: 'READY' }));
      app.get('/liveness', (req, res) => res.json({ status: 'UP' }));

      const r1 = await request(app).get('/health');
      const r2 = await request(app).get('/ready');
      const r3 = await request(app).get('/liveness');

      expect(r1.status).toBe(200);
      expect(r2.status).toBe(200);
      expect(r3.status).toBe(200);
    });

    it('sheds LOWER_PRIORITY requests when in-flight capacity exceeds lower threshold (80%)', async () => {
      const app = express();
      // maxInflight = 10; lowerThreshold (80%) = 8; importantThreshold (95%) = 9
      app.use(
        createLoadSheddingMiddleware({
          maxInflight: 10,
          lowerPriorityThresholdPercent: 80,
          importantThresholdPercent: 95,
          retryAfterSeconds: 7,
        }),
      );

      const holdResolvers = [];
      app.get('/api/v1/hold', (req, res) => {
        new Promise((resolve) => {
          holdResolvers.push(resolve);
        }).then(() => res.json({ held: true }));
      });
      app.get('/api/v1/seller/analytics', (req, res) => res.json({ analytics: true }));
      app.get('/api/v1/products', (req, res) => res.json({ products: true }));
      app.post('/api/v1/payments', (req, res) => res.json({ payment: true }));

      const server = app.listen(0);
      try {
        // Actively spawn 8 in-flight requests
        const holdPromises = [];
        for (let i = 0; i < 8; i++) {
          const reqPromise = request(server).get('/api/v1/hold');
          reqPromise.catch(() => {});
          holdPromises.push(reqPromise);
        }

        // Wait until all 8 requests are actively held in-flight
        while (holdResolvers.length < 8) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        const metricsAtCapacity = getLoadSheddingMetrics();
        expect(metricsAtCapacity.activeRequests).toBe(8);

        // LOWER_PRIORITY (/api/v1/seller/analytics) must be shed with HTTP 503 and Retry-After
        const shedRes = await request(server).get('/api/v1/seller/analytics');
        expect(shedRes.status).toBe(503);
        expect(shedRes.headers['retry-after']).toBe('7');
        expect(shedRes.body.success).toBe(false);
        expect(shedRes.body.error.code).toBe('OVERLOAD_LOAD_SHED');
        expect(shedRes.body.error.priority).toBe('LOWER_PRIORITY');

        // IMPORTANT (/api/v1/products) should still succeed (8 < 9)
        const importantRes = await request(server).get('/api/v1/products');
        expect(importantRes.status).toBe(200);

        // CRITICAL (/api/v1/payments) must continue to succeed
        const criticalRes = await request(server).post('/api/v1/payments');
        expect(criticalRes.status).toBe(200);

        // Release held requests and verify active count decreases safely
        holdResolvers.forEach((resolve) => resolve());
        await Promise.all(holdPromises);

        const metricsAfterRelease = getLoadSheddingMetrics();
        expect(metricsAfterRelease.activeRequests).toBe(0);
        expect(metricsAfterRelease.shedRequests).toBe(1);
        expect(metricsAfterRelease.shedByPriority.LOWER_PRIORITY).toBe(1);
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    });

    it('sheds IMPORTANT requests when in-flight capacity exceeds important threshold (95%) while CRITICAL succeeds', async () => {
      const app = express();
      app.use(
        createLoadSheddingMiddleware({
          maxInflight: 10,
          lowerPriorityThresholdPercent: 80,
          importantThresholdPercent: 95, // threshold = 9
          retryAfterSeconds: 5,
        }),
      );

      const holdResolvers = [];
      app.get('/api/v1/hold', (req, res) => {
        new Promise((resolve) => {
          holdResolvers.push(resolve);
        }).then(() => res.json({ held: true }));
      });
      app.get('/api/v1/products', (req, res) => res.json({ products: true }));
      app.post('/api/v1/payments', (req, res) => res.json({ payment: true }));

      const server = app.listen(0);
      try {
        // Spawn 9 in-flight requests
        const holdPromises = [];
        for (let i = 0; i < 9; i++) {
          const reqPromise = request(server).get('/api/v1/hold');
          reqPromise.catch(() => {});
          holdPromises.push(reqPromise);
        }

        while (holdResolvers.length < 9) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        // IMPORTANT request must now be shed
        const shedImportantRes = await request(server).get('/api/v1/products');
        expect(shedImportantRes.status).toBe(503);
        expect(shedImportantRes.body.error.code).toBe('OVERLOAD_LOAD_SHED');
        expect(shedImportantRes.body.error.priority).toBe('IMPORTANT');

        // CRITICAL request must continue without interruption
        const criticalRes = await request(server).post('/api/v1/payments');
        expect(criticalRes.status).toBe(200);

        // Cleanup
        holdResolvers.forEach((resolve) => resolve());
        await Promise.all(holdPromises);
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    });

    it('safely decrements exactly once on both finish and close events (prevents double decrement)', async () => {
      const app = express();
      app.use(createLoadSheddingMiddleware({ maxInflight: 10 }));
      app.get('/api/v1/test-clean', (req, res) => {
        res.write('chunk');
        res.emit('close'); // Simulate premature connection close
        res.end(); // Normal finish
      });

      await request(app).get('/api/v1/test-clean');

      const metrics = getLoadSheddingMetrics();
      expect(metrics.activeRequests).toBe(0);
    });
  });

  describe('Phase 3E: Response Compression (Brotli, Gzip, Deflate, SSE Bypass)', () => {
    const sampleText = 'Ecommerce Platform Production API '.repeat(100); // > 1024 bytes

    it('compresses with Gzip when Accept-Encoding specifies gzip', async () => {
      const app = express();
      app.use(createCompressionMiddleware({ threshold: 100 }));
      app.get('/api/v1/products', (req, res) => {
        res.json({ text: sampleText });
      });

      const res = await rawHttpRequest({
        app,
        path: '/api/v1/products',
        headers: { 'Accept-Encoding': 'gzip' },
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-encoding']).toBe('gzip');
      expect(res.headers.vary).toContain('Accept-Encoding');

      // Verify response integrity by decompressing with zlib
      const decompressed = zlib.gunzipSync(res.body).toString();
      const parsed = JSON.parse(decompressed);
      expect(parsed.text).toBe(sampleText);
    });

    it('compresses with Brotli when Accept-Encoding specifies br', async () => {
      const app = express();
      app.use(createCompressionMiddleware({ threshold: 100 }));
      app.get('/api/v1/catalog', (req, res) => {
        res.json({ text: sampleText });
      });

      const res = await rawHttpRequest({
        app,
        path: '/api/v1/catalog',
        headers: { 'Accept-Encoding': 'br, gzip' },
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-encoding']).toBe('br');

      const decompressed = zlib.brotliDecompressSync(res.body).toString();
      const parsed = JSON.parse(decompressed);
      expect(parsed.text).toBe(sampleText);
    });

    it('compresses with Deflate when Accept-Encoding specifies deflate', async () => {
      const app = express();
      app.use(createCompressionMiddleware({ threshold: 100 }));
      app.get('/api/v1/items', (req, res) => {
        res.json({ text: sampleText });
      });

      const res = await rawHttpRequest({
        app,
        path: '/api/v1/items',
        headers: { 'Accept-Encoding': 'deflate' },
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-encoding']).toBe('deflate');

      const decompressed = zlib.inflateSync(res.body).toString();
      const parsed = JSON.parse(decompressed);
      expect(parsed.text).toBe(sampleText);
    });

    it('bypasses compression when response length is below threshold', async () => {
      const app = express();
      app.use(createCompressionMiddleware({ threshold: 1024 }));
      app.get('/api/v1/small', (req, res) => {
        res.json({ ok: true }); // < 1024 bytes
      });

      const res = await request(app).get('/api/v1/small').set('Accept-Encoding', 'gzip');

      expect(res.status).toBe(200);
      expect(res.headers['content-encoding']).toBeUndefined();
      expect(res.body).toEqual({ ok: true });
    });

    it('bypasses compression for HEAD requests', async () => {
      const app = express();
      app.use(createCompressionMiddleware({ threshold: 10 }));
      app.get('/api/v1/head-test', (req, res) => {
        res.send(sampleText);
      });

      const res = await request(app).head('/api/v1/head-test').set('Accept-Encoding', 'gzip');

      expect(res.status).toBe(200);
      expect(res.headers['content-encoding']).toBeUndefined();
    });

    it('bypasses compression for Server-Sent Events (SSE) to preserve real-time streaming', async () => {
      const app = express();
      app.use(createCompressionMiddleware({ threshold: 10 }));
      app.get('/api/v1/notifications/stream', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.send('data: ' + sampleText + '\n\n');
      });

      const res = await request(app)
        .get('/api/v1/notifications/stream')
        .set('Accept', 'text/event-stream')
        .set('Accept-Encoding', 'gzip');

      expect(res.status).toBe(200);
      expect(res.headers['content-encoding']).toBeUndefined();
      expect(res.text).toContain('data: Ecommerce Platform');
    });

    it('does not double compress if response already has a Content-Encoding', async () => {
      const app = express();
      app.use(createCompressionMiddleware({ threshold: 10 }));
      app.get('/api/v1/pre-compressed', (req, res) => {
        const compressed = zlib.gzipSync(Buffer.from(sampleText));
        res.setHeader('Content-Encoding', 'gzip');
        res.send(compressed);
      });

      const res = await rawHttpRequest({
        app,
        path: '/api/v1/pre-compressed',
        headers: { 'Accept-Encoding': 'br, gzip' },
      });

      expect(res.headers['content-encoding']).toBe('gzip');
      const decompressed = zlib.gunzipSync(res.body).toString();
      expect(decompressed).toBe(sampleText);
    });
  });

  describe('Phase 3F: Request Size Limits & URI Bounding', () => {
    it('rejects oversized JSON payloads with HTTP 413 and structured error', async () => {
      const app = express();
      app.use(createRequestLimitsMiddleware({ jsonLimit: '10kb' }));
      app.post('/api/v1/products', (req, res) => {
        res.json({ success: true });
      });

      // Generate 25KB JSON payload
      const largePayload = {
        title: 'Oversized Product',
        description: 'x'.repeat(25 * 1024),
      };

      const res = await request(app)
        .post('/api/v1/products')
        .send(largePayload)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(413);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
      expect(res.body.error.limit).toBeDefined();
    });

    it('rejects oversized URL-encoded payloads with HTTP 413', async () => {
      const app = express();
      app.use(createRequestLimitsMiddleware({ urlEncodedLimit: '5kb' }));
      app.post('/api/v1/form', (req, res) => {
        res.json({ success: true });
      });

      const oversizedData = 'comment=' + 'a'.repeat(10 * 1024);

      const res = await request(app)
        .post('/api/v1/form')
        .send(oversizedData)
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(res.status).toBe(413);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
    });

    it('rejects excessively long URIs with HTTP 414 URI Too Long', async () => {
      const app = express();
      app.use(createUriLengthCheck(100)); // Cap URI length at 100 characters for test
      app.get('/api/v1/search', (req, res) => {
        res.json({ ok: true });
      });

      const longQuery = 'q=' + 'a'.repeat(150);
      const res = await request(app).get(`/api/v1/search?${longQuery}`);

      expect(res.status).toBe(414);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('URI_TOO_LONG');
    });

    it('allows valid requests within configured size and URI bounds', async () => {
      const app = express();
      app.use(createRequestLimitsMiddleware({ jsonLimit: '1mb', maxUriLength: 2048 }));
      app.post('/api/v1/products', (req, res) => {
        res.json({ success: true, received: req.body.title });
      });

      const validPayload = { title: 'Standard Product', price: 99.99 };
      const res = await request(app)
        .post('/api/v1/products')
        .send(validPayload)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.received).toBe('Standard Product');
    });
  });
});
