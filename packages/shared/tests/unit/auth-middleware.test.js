import { authenticate, optionalAuthenticate } from '../../src/middleware/auth.js';
import { requireRole } from '../../src/middleware/rbac.js';
import { SecurityHeaders } from '../../src/constants/headers.js';
import { Roles } from '../../src/constants/roles.js';
import { generateAccessToken } from '../../src/utils/jwt.js';

describe('Auth & RBAC Middleware', () => {
  const secret = 'ecom_default_jwt_secret_dev_only_change_in_prod';
  const internalSecret = 'ecom_internal_mesh_secret_2026';

  describe('authenticate', () => {
    it('should trust identity headers when valid internal gateway secret is present', (done) => {
      const req = {
        headers: {
          [SecurityHeaders.INTERNAL_GATEWAY_SECRET]: internalSecret,
          [SecurityHeaders.USER_ID]: 'user-123',
          [SecurityHeaders.USER_ROLE]: Roles.SELLER,
          [SecurityHeaders.USER_EMAIL]: 'seller@example.com',
          [SecurityHeaders.SELLER_ID]: 'seller-456',
        },
      };
      const res = {};
      authenticate(req, res, (err) => {
        expect(err).toBeUndefined();
        expect(req.user).toEqual({
          id: 'user-123',
          role: Roles.SELLER,
          email: 'seller@example.com',
          sellerId: 'seller-456',
        });
        done();
      });
    });

    it('should reject spoofed identity headers without valid internal gateway secret', (done) => {
      const req = {
        headers: {
          [SecurityHeaders.USER_ID]: 'admin-uuid',
          [SecurityHeaders.USER_ROLE]: Roles.ADMIN,
        },
      };
      const res = {};
      authenticate(req, res, (err) => {
        expect(err).toBeDefined();
        expect(err.statusCode).toBe(403);
        done();
      });
    });

    it('should authenticate direct JWT bearer token', (done) => {
      const token = generateAccessToken({ sub: 'user-789', role: Roles.CUSTOMER, email: 'cus@test.com' }, secret);
      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res = {};
      authenticate(req, res, (err) => {
        expect(err).toBeUndefined();
        expect(req.user.id).toBe('user-789');
        expect(req.user.role).toBe(Roles.CUSTOMER);
        done();
      });
    });
  });

  describe('requireRole', () => {
    it('should allow user with matching role', (done) => {
      const req = { user: { role: Roles.ADMIN } };
      const res = {};
      requireRole(Roles.ADMIN)(req, res, (err) => {
        expect(err).toBeUndefined();
        done();
      });
    });

    it('should reject user with non-matching role', (done) => {
      const req = { user: { role: Roles.CUSTOMER } };
      const res = {};
      requireRole(Roles.ADMIN, Roles.SELLER)(req, res, (err) => {
        expect(err).toBeDefined();
        expect(err.statusCode).toBe(403);
        done();
      });
    });
  });
});
