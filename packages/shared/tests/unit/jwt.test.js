import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../src/utils/jwt.js';
import { UnauthorizedError } from '../../src/errors/specific-errors.js';

describe('JWT Utilities', () => {
  const secret = 'test-secret-key-12345';
  const refreshSecret = 'test-refresh-secret-12345';
  const payload = { sub: 'user-uuid-123', role: 'CUSTOMER', email: 'test@example.com' };

  it('should generate and verify an access token', () => {
    const token = generateAccessToken(payload, secret);
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token, secret);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.email).toBe(payload.email);
  });

  it('should generate and verify a refresh token', () => {
    const token = generateRefreshToken(payload, refreshSecret);
    expect(typeof token).toBe('string');

    const decoded = verifyRefreshToken(token, refreshSecret);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.role).toBe(payload.role);
  });

  it('should throw UnauthorizedError on invalid token signature', () => {
    const token = generateAccessToken(payload, secret);
    expect(() => verifyAccessToken(token, 'wrong-secret')).toThrow(UnauthorizedError);
  });
});
