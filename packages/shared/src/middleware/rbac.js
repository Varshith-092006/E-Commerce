import { ForbiddenError, UnauthorizedError } from '../errors/specific-errors.js';
import { Roles } from '../constants/roles.js';

/**
 * Enforces that the authenticated user possesses at least one of the allowed roles.
 * @param {...string} allowedRoles
 * @returns {Function} Express middleware
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied: Requires role ${allowedRoles.join(' or ')}`));
    }

    next();
  };
}

/**
 * Convenience middleware requiring ADMIN role
 */
export const requireAdmin = requireRole(Roles.ADMIN);

/**
 * Convenience middleware requiring SELLER role
 */
export const requireSeller = requireRole(Roles.SELLER);

/**
 * Convenience middleware requiring CUSTOMER role
 */
export const requireCustomer = requireRole(Roles.CUSTOMER);
