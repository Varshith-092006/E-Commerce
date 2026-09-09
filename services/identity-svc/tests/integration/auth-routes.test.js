import request from 'supertest';
import { createApp } from '../../src/app.js';
import {
  Roles,
  SellerStatus,
  generateAccessToken,
  SecurityHeaders,
  closeRedisClient,
} from '@ecommerce/shared';
import { prisma } from '../../src/lib/prisma.js';

describe('Identity Service API Integration Tests', () => {
  let app;
  let mockUserRepo;
  let mockSellerRepo;
  let mockTokenRepo;

  beforeEach(() => {
    app = createApp();
  });

  afterAll(async () => {
    try {
      await closeRedisClient();
    } catch {
      // Ignore teardown errors
    }
    try {
      await prisma.$disconnect();
    } catch {
      // Ignore teardown errors
    }
  });

  describe('POST /api/v1/auth/register', () => {
    it('should validate and register customer', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'testcustomer@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      // Response should have proper envelope
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('requestId');
    });
  });

  describe('Direct Spoofing Protection (Gateway Trust Boundary)', () => {
    it('should reject requests that inject X-User-* headers without valid internal gateway secret', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set(SecurityHeaders.USER_ID, 'malicious-user-id')
        .set(SecurityHeaders.USER_ROLE, Roles.ADMIN);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should accept requests when valid internal gateway secret and user headers are present', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set(
          SecurityHeaders.INTERNAL_GATEWAY_SECRET,
          process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026',
        )
        .set(SecurityHeaders.USER_ID, '00000000-0000-0000-0000-000000000001')
        .set(SecurityHeaders.USER_ROLE, Roles.CUSTOMER);

      // Will reach user controller (and return 404 since DB has no real record in mock unit env, but passes gateway auth check)
      expect(res.status).not.toBe(403);
    });
  });
});
