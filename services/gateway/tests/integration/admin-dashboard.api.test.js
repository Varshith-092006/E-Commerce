import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { generateAccessToken } from '@ecommerce/shared';

describe('Admin Dashboard API Integration Tests (Phase 5)', () => {
  let app;
  let adminToken;
  let customerToken;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_jwt_secret_for_phase5_e2e_verification_key_32bytes';
    process.env.INTERNAL_GATEWAY_SECRET = 'ecom_internal_mesh_secret_2026';

    adminToken = generateAccessToken({
      userId: '11111111-1111-1111-1111-111111111111',
      role: 'ADMIN',
      email: 'admin@ecommerce.com',
    });

    customerToken = generateAccessToken({
      userId: '22222222-2222-2222-2222-222222222222',
      role: 'CUSTOMER',
      email: 'customer@ecommerce.com',
    });

    const mockRedis = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      ping: jest.fn().mockResolvedValue('PONG'),
      multi: () => ({
        incr: () => {},
        ttl: () => {},
        exec: async () => [[null, 1], [null, 60]],
      }),
      expire: async () => 1,
    };

    app = createApp({
      checkRedisHealth: async () => ({ status: 'healthy', latencyMs: 1 }),
      getRedisClient: () => mockRedis,
    });
  });

  describe('GET /api/v1/admin/dashboard/stats', () => {
    it('should reject unauthenticated request with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard/stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject customer user with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should accept ADMIN user and return structured dashboard KPIs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sales).toBeDefined();
      expect(res.body.data.orders).toBeDefined();
      expect(res.body.data.fulfillment).toBeDefined();
      expect(res.body.data.system).toBeDefined();
    });
  });

  describe('GET /api/v1/admin/audit-logs', () => {
    it('should reject customer request with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });

    it('should accept ADMIN and return paginated audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
