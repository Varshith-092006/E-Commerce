import { jest } from '@jest/globals';
import { AuthService } from '../../src/services/auth-service.js';
import { ConflictError, Roles, SellerStatus } from '@ecommerce/shared';

describe('AuthService Unit Tests', () => {
  let authService;
  let mockUserRepo;
  let mockSellerRepo;
  let mockTokenRepo;
  let mockDb;

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      setVerified: jest.fn(),
      updatePassword: jest.fn(),
    };
    mockSellerRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
    };
    mockTokenRepo = {
      createRefreshToken: jest.fn(),
      findRefreshToken: jest.fn(),
      rotateRefreshToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
      revokeAllUserRefreshTokens: jest.fn(),
      createVerificationToken: jest.fn(),
      findLatestVerificationToken: jest.fn(),
      incrementAttemptCount: jest.fn(),
      updateResend: jest.fn(),
      markTokenUsed: jest.fn(),
    };
    mockDb = {
      $transaction: jest.fn((cb) =>
        cb({
          user: {
            create: jest.fn().mockResolvedValue({
              id: 'user-1',
              email: 'seller@test.com',
              first_name: 'Jane',
              last_name: 'Doe',
              role: 'SELLER',
              is_verified: false,
            }),
          },
          seller: {
            create: jest.fn().mockResolvedValue({
              id: 'seller-1',
              business_name: 'Acme',
              store_slug: 'acme',
              status: 'PENDING',
            }),
          },
          verificationToken: { create: jest.fn().mockResolvedValue({}) },
        }),
      ),
    };

    authService = new AuthService({
      userRepo: mockUserRepo,
      sellerRepo: mockSellerRepo,
      tokenRepo: mockTokenRepo,
      db: mockDb,
    });
  });

  describe('Customer Registration', () => {
    it('should register a new customer and generate hashed verification token', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue({
        id: 'user-uuid',
        email: 'customer@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: Roles.CUSTOMER,
        is_verified: false,
      });

      const result = await authService.registerCustomer({
        email: 'customer@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.user.email).toBe('customer@example.com');
      expect(result.otp).toHaveLength(6);
      expect(mockTokenRepo.createVerificationToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-uuid',
          type: 'EMAIL_VERIFY',
        }),
      );
    });

    it('should reject duplicate customer registration with ConflictError', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.registerCustomer({
          email: 'existing@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('Unified Seller Registration', () => {
    it('should create user and seller profile in PENDING state atomically', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockSellerRepo.findBySlug.mockResolvedValue(null);

      const result = await authService.registerSeller({
        email: 'seller@test.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        businessName: 'Acme',
        storeSlug: 'acme',
        gstin: '29ABCDE1234F1Z5',
        pan: 'ABCDE1234F',
      });

      expect(result.user.role).toBe(Roles.SELLER);
      expect(result.user.seller.status).toBe(SellerStatus.PENDING);
      expect(result.otp).toBeDefined();
    });

    it('should reject duplicate store slug with ConflictError', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockSellerRepo.findBySlug.mockResolvedValue({ id: 'existing-seller' });

      await expect(
        authService.registerSeller({
          email: 'seller2@test.com',
          password: 'Password123!',
          firstName: 'Jane',
          lastName: 'Doe',
          businessName: 'Acme 2',
          storeSlug: 'acme',
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('Anti-Enumeration Forgot Password', () => {
    it('should return generic response without revealing whether email exists or not', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null); // non-existing user

      const responseNonExistent = await authService.forgotPassword({
        email: 'nonexistent@example.com',
      });
      expect(responseNonExistent.message).toContain('If that email exists in our system');

      mockUserRepo.findByEmail.mockResolvedValue({ id: 'user-uuid' }); // existing user
      const responseExistent = await authService.forgotPassword({
        email: 'existent@example.com',
      });
      expect(responseExistent.message).toContain('If that email exists in our system');
      expect(mockTokenRepo.createVerificationToken).toHaveBeenCalled();
    });
  });
});
