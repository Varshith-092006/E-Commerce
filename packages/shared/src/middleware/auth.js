import { UnauthorizedError, ForbiddenError } from '../errors/specific-errors.js';
import { SecurityHeaders } from '../constants/headers.js';
import { verifyAccessToken } from '../utils/jwt.js';

// Dev-only fallback — MUST match gateway config's DEV_ONLY_INTERNAL_SECRET.
// In production, INTERNAL_GATEWAY_SECRET must be explicitly set.
// This constant must NEVER be used in production.
const DEV_ONLY_INTERNAL_SECRET = 'ecom_internal_mesh_secret_2026';

/**
 * Middleware that authenticates requests on internal services.
 * Enforces the Gateway trust boundary:
 * 1. Checks for trusted Gateway internal secret + forwarded identity headers.
 * 2. Alternatively validates direct JWT Bearer token.
 * 3. Strips and rejects any spoofed/unverified identity headers.
 */
export function authenticate(req, res, next) {
  const internalSecret = req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET];
  const expectedSecret = process.env.INTERNAL_GATEWAY_SECRET || DEV_ONLY_INTERNAL_SECRET;

  const headerUserId = req.headers[SecurityHeaders.USER_ID];
  const headerUserRole = req.headers[SecurityHeaders.USER_ROLE];
  const headerUserEmail = req.headers[SecurityHeaders.USER_EMAIL];
  const headerSellerId = req.headers[SecurityHeaders.SELLER_ID];

  // Case 1: Request from trusted Gateway with valid internal secret
  if (internalSecret === expectedSecret) {
    if (headerUserId && headerUserRole) {
      req.user = {
        id: headerUserId,
        role: headerUserRole,
        email: headerUserEmail || null,
        sellerId: headerSellerId || null,
      };
      return next();
    }
    // Gateway forwarded an unauthenticated request
    return next(new UnauthorizedError('Authentication required'));
  }

  // Case 2: Attempted spoofing (client-supplied x-user-* without valid gateway secret)
  if (headerUserId || headerUserRole || headerUserEmail || headerSellerId) {
    return next(new ForbiddenError('Direct identity header injection forbidden'));
  }

  // Case 3: Direct JWT Bearer token or Query Token (for EventSource SSE)
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.sub || decoded.id || decoded.userId,
        role: decoded.role,
        email: decoded.email,
        sellerId: decoded.sellerId || null,
      };
      return next();
    } catch (err) {
      return next(err);
    }
  }

  return next(new UnauthorizedError('Authentication required'));
}

/**
 * Optional authentication middleware for endpoints accessible by both
 * authenticated and guest users (e.g., browse, search, product details).
 */
export function optionalAuthenticate(req, res, next) {
  const internalSecret = req.headers[SecurityHeaders.INTERNAL_GATEWAY_SECRET];
  const expectedSecret = process.env.INTERNAL_GATEWAY_SECRET || DEV_ONLY_INTERNAL_SECRET;

  const headerUserId = req.headers[SecurityHeaders.USER_ID];
  const headerUserRole = req.headers[SecurityHeaders.USER_ROLE];
  const headerUserEmail = req.headers[SecurityHeaders.USER_EMAIL];
  const headerSellerId = req.headers[SecurityHeaders.SELLER_ID];

  if (internalSecret === expectedSecret) {
    if (headerUserId && headerUserRole) {
      req.user = {
        id: headerUserId,
        role: headerUserRole,
        email: headerUserEmail || null,
        sellerId: headerSellerId || null,
      };
    }
    return next();
  }

  // Reject spoofing attempts on public endpoints
  if (headerUserId || headerUserRole || headerUserEmail || headerSellerId) {
    return next(new ForbiddenError('Direct identity header injection forbidden'));
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.sub || decoded.id || decoded.userId,
        role: decoded.role,
        email: decoded.email,
        sellerId: decoded.sellerId || null,
      };
    } catch {
      // Ignored for optional auth
    }
  }

  return next();
}

export const requireAuth = authenticate;
