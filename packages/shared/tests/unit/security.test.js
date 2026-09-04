import {
  hashPassword,
  comparePassword,
  hashToken,
  generateSecureOtp,
  generateSecureToken,
} from '../../src/utils/security.js';

describe('Security Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash a password and verify successfully', async () => {
      const password = 'StrongPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);

      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await comparePassword('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });

    it('should return false when comparing with empty password or hash', async () => {
      expect(await comparePassword('', 'hash')).toBe(false);
      expect(await comparePassword('pass', '')).toBe(false);
    });
  });

  describe('Token Hashing (SHA-256)', () => {
    it('should generate deterministic sha256 hash', () => {
      const token = '123456';
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);

      expect(hash1).toEqual(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex length
    });

    it('should throw error for invalid token input', () => {
      expect(() => hashToken('')).toThrow();
      expect(() => hashToken(null)).toThrow();
    });
  });

  describe('Secure Generators', () => {
    it('should generate 6 digit numeric OTP by default', () => {
      const otp = generateSecureOtp(6);
      expect(otp).toHaveLength(6);
      expect(Number(otp)).toBeGreaterThanOrEqual(100000);
      expect(Number(otp)).toBeLessThanOrEqual(999999);
    });

    it('should generate random hex tokens', () => {
      const token = generateSecureToken(32);
      expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
    });
  });
});
