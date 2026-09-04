import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../errors/specific-errors.js';
import { PlatformPolicies } from '../constants/policies.js';

const DEFAULT_JWT_SECRET = 'ecom_default_jwt_secret_dev_only_change_in_prod';
const DEFAULT_REFRESH_SECRET = 'ecom_default_refresh_secret_dev_only_change_in_prod';

/**
 * Generates an Access Token with 15-minute TTL
 * @param {Object} payload
 * @param {string} [secret]
 * @returns {string} Signed JWT
 */
export function generateAccessToken(
  payload,
  secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
) {
  return jwt.sign(payload, secret, {
    expiresIn: PlatformPolicies.ACCESS_TOKEN_TTL_SECONDS,
  });
}

/**
 * Generates a Refresh Token with 30-day TTL
 * @param {Object} payload
 * @param {string} [secret]
 * @returns {string} Signed JWT
 */
export function generateRefreshToken(
  payload,
  secret = process.env.JWT_REFRESH_SECRET || DEFAULT_REFRESH_SECRET,
) {
  return jwt.sign(payload, secret, {
    expiresIn: PlatformPolicies.REFRESH_TOKEN_TTL_SECONDS,
  });
}

/**
 * Verifies an Access Token
 * @param {string} token
 * @param {string} [secret]
 * @returns {Object} Decoded payload
 */
export function verifyAccessToken(token, secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token has expired', { isExpired: true });
    }
    throw new UnauthorizedError('Invalid access token');
  }
}

/**
 * Verifies a Refresh Token
 * @param {string} token
 * @param {string} [secret]
 * @returns {Object} Decoded payload
 */
export function verifyRefreshToken(
  token,
  secret = process.env.JWT_REFRESH_SECRET || DEFAULT_REFRESH_SECRET,
) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Refresh token has expired', { isExpired: true });
    }
    throw new UnauthorizedError('Invalid refresh token');
  }
}
