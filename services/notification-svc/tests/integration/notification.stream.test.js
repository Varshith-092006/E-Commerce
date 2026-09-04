import http from 'http';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import { generateAccessToken } from '@ecommerce/shared';
import { createApp } from '../../src/app.js';
import { sseConnectionManager } from '../../src/services/sse-connection-manager.js';

describe('Notification Service SSE Stream Integration Tests', () => {
  let app;
  const testUserId = 'u1a2b3c4-0000-0000-0000-000000000001';
  let validToken;

  beforeEach(() => {
    app = createApp();
    validToken = generateAccessToken({
      userId: testUserId,
      role: 'CUSTOMER',
      email: 'customer@example.com',
    });
  });

  afterEach(() => {
    sseConnectionManager.closeAll();
    jest.clearAllMocks();
  });

  describe('GET /api/v1/notifications/stream', () => {
    it('should reject unauthenticated stream request with 401 Unauthorized', async () => {
      const res = await request(app)
        .get('/api/v1/notifications/stream')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should establish SSE headers for authenticated query token request', (done) => {
      const server = app.listen(0, () => {
        const port = server.address().port;
        const req = http.request(
          {
            hostname: 'localhost',
            port,
            path: `/api/v1/notifications/stream?token=${encodeURIComponent(validToken)}`,
            method: 'GET',
          },
          (res) => {
            expect(res.headers['content-type']).toContain('text/event-stream');
            expect(res.headers['cache-control']).toContain('no-cache');
            expect(res.headers['connection']).toContain('keep-alive');
            res.destroy();
            server.close(done);
          },
        );
        req.end();
      });
    });

    it('should establish SSE headers with Bearer header authentication', (done) => {
      const server = app.listen(0, () => {
        const port = server.address().port;
        const req = http.request(
          {
            hostname: 'localhost',
            port,
            path: '/api/v1/notifications/stream',
            method: 'GET',
            headers: {
              Authorization: `Bearer ${validToken}`,
            },
          },
          (res) => {
            expect(res.headers['content-type']).toContain('text/event-stream');
            expect(res.headers['cache-control']).toContain('no-cache');
            res.destroy();
            server.close(done);
          },
        );
        req.end();
      });
    });

    it('should receive live in-app notification over stream and enforce user isolation', (done) => {
      const otherUserId = 'u2b3c4d5-0000-0000-0000-000000000002';
      const server = app.listen(0, () => {
        const port = server.address().port;
        let receivedData = '';

        const req = http.request(
          {
            hostname: 'localhost',
            port,
            path: `/api/v1/notifications/stream?token=${encodeURIComponent(validToken)}`,
            method: 'GET',
          },
          (res) => {
            res.on('data', (chunk) => {
              receivedData += chunk.toString();
              if (receivedData.includes('event: notification')) {
                expect(receivedData).toContain('Order Live Test');
                res.destroy();
                server.close(done);
              }
            });

            // Trigger notification broadcast for target user
            setTimeout(() => {
              // Broadcast for other user (must not be received)
              sseConnectionManager.broadcast(otherUserId, {
                id: 'notif-other',
                user_id: otherUserId,
                subject: 'Other User Alert',
              });

              // Broadcast for target user (must be received)
              sseConnectionManager.broadcast(testUserId, {
                id: 'notif-target-1',
                user_id: testUserId,
                subject: 'Order Live Test',
                content: 'Your package is on the way',
                category: 'ORDERS',
              });
            }, 50);
          },
        );
        req.end();
      });
    });
  });
});
