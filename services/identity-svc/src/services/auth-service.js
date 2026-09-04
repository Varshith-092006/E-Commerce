import {
  hashPassword,
  comparePassword,
  hashToken,
  generateSecureOtp,
  generateSecureToken,
  generateAccessToken,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  PlatformPolicies,
  Roles,
  SellerStatus,
  createLogger,
} from '@ecommerce/shared';

import { UserRepository } from '../repositories/user-repository.js';
import { SellerRepository } from '../repositories/seller-repository.js';
import { TokenRepository } from '../repositories/token-repository.js';
import { prisma } from '../lib/prisma.js';

const logger = createLogger({ service: 'identity-svc:auth' });

export class AuthService {
  constructor({
    userRepo = new UserRepository(),
    sellerRepo = new SellerRepository(),
    tokenRepo = new TokenRepository(),
    db = prisma,
  } = {}) {
    this.userRepo = userRepo;
    this.sellerRepo = sellerRepo;
    this.tokenRepo = tokenRepo;
    this.db = db;
  }

  /**
   * Registers a customer account
   */
  async registerCustomer({ email, password, firstName, lastName, phone }) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await this.userRepo.create({
      email,
      phone,
      passwordHash,
      firstName,
      lastName,
      role: Roles.CUSTOMER,
      isVerified: false,
    });

    const otp = generateSecureOtp(6);
    const otpHash = hashToken(otp);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15m

    await this.tokenRepo.createVerificationToken({
      userId: user.id,
      tokenHash: otpHash,
      type: 'EMAIL_VERIFY',
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isVerified: user.is_verified,
      },
      otp, // For automated testing / notification simulation
    };
  }

  /**
   * Unified seller registration: creates User + Seller profile in PENDING state atomically
   */
  async registerSeller({
    email,
    password,
    firstName,
    lastName,
    phone,
    businessName,
    storeSlug,
    gstin,
    pan,
    businessAddress,
  }) {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    const existingSlug = await this.sellerRepo.findBySlug(storeSlug);
    if (existingSlug) {
      throw new ConflictError('Store slug is already taken');
    }

    const passwordHash = await hashPassword(password);

    const result = await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          phone: phone || null,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role: Roles.SELLER,
          is_verified: false,
        },
      });

      const seller = await tx.seller.create({
        data: {
          user_id: user.id,
          business_name: businessName,
          store_slug: storeSlug.toLowerCase().trim(),
          gstin: gstin || null,
          pan: pan || null,
          business_address: businessAddress || null,
          status: SellerStatus.PENDING,
        },
      });

      const otp = generateSecureOtp(6);
      const otpHash = hashToken(otp);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await tx.verificationToken.create({
        data: {
          user_id: user.id,
          token_hash: otpHash,
          type: 'EMAIL_VERIFY',
          expires_at: expiresAt,
          attempt_count: 0,
          resend_count: 0,
        },
      });

      return { user, seller, otp };
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        role: result.user.role,
        isVerified: result.user.is_verified,
        seller: {
          id: result.seller.id,
          businessName: result.seller.business_name,
          storeSlug: result.seller.store_slug,
          status: result.seller.status,
        },
      },
      otp: result.otp,
    };
  }

  /**
   * Verifies email with OTP
   */
  async verifyEmail({ email, otp }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestError('Invalid email or verification code');
    }

    if (user.is_verified) {
      return { message: 'Account is already verified' };
    }

    const tokenRecord = await this.tokenRepo.findLatestVerificationToken(user.id, 'EMAIL_VERIFY');

    if (!tokenRecord) {
      throw new BadRequestError('No active verification code found');
    }

    if (tokenRecord.expires_at < new Date()) {
      throw new BadRequestError('Verification code has expired');
    }

    if (tokenRecord.attempt_count >= 5) {
      throw new ForbiddenError('Too many failed verification attempts. Please request a new code.');
    }

    await this.tokenRepo.incrementAttemptCount(tokenRecord.id);

    const inputHash = hashToken(otp);
    if (inputHash !== tokenRecord.token_hash) {
      throw new BadRequestError('Invalid verification code');
    }

    await Promise.all([
      this.tokenRepo.markTokenUsed(tokenRecord.id),
      this.userRepo.setVerified(user.id, true),
    ]);

    return { message: 'Account successfully verified' };
  }

  /**
   * Resends verification OTP with 60s cooldown and max 3 resends/hour
   */
  async resendVerification({ email }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || user.is_verified) {
      return { message: 'If your account is eligible, a new verification code has been sent.' };
    }

    const tokenRecord = await this.tokenRepo.findLatestVerificationToken(user.id, 'EMAIL_VERIFY');

    if (tokenRecord) {
      const now = Date.now();
      const lastSent = new Date(tokenRecord.last_sent_at).getTime();
      const elapsedSeconds = (now - lastSent) / 1000;

      if (elapsedSeconds < 60) {
        const waitSeconds = Math.ceil(60 - elapsedSeconds);
        throw new BadRequestError(
          `Please wait ${waitSeconds} seconds before requesting another code`,
        );
      }

      if (tokenRecord.resend_count >= 3) {
        throw new ForbiddenError(
          'Maximum resend limit reached for this session. Please try again later.',
        );
      }
    }

    const otp = generateSecureOtp(6);
    const otpHash = hashToken(otp);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    if (tokenRecord) {
      await this.tokenRepo.updateResend(tokenRecord.id, otpHash, expiresAt);
    } else {
      await this.tokenRepo.createVerificationToken({
        userId: user.id,
        tokenHash: otpHash,
        type: 'EMAIL_VERIFY',
        expiresAt,
      });
    }

    return {
      message: 'If your account is eligible, a new verification code has been sent.',
      otp, // included for testing
    };
  }

  /**
   * Authenticates user and issues access token + refresh token
   */
  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      if (user.role === Roles.ADMIN) {
        logger.warn(
          { userId: user.id, email: user.email, event: 'ADMIN_LOGIN_FAILURE' },
          'Failed authentication attempt on privileged ADMIN account',
        );
      }
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.is_active) {
      throw new ForbiddenError('Your account has been deactivated. Please contact support.');
    }

    if (user.role === Roles.ADMIN) {
      logger.info(
        { userId: user.id, email: user.email, event: 'ADMIN_LOGIN_SUCCESS' },
        'Successful authentication on privileged ADMIN account',
      );
    }

    let sellerInfo = null;
    if (user.role === Roles.SELLER) {
      const seller = await this.sellerRepo.findByUserId(user.id);
      if (seller) {
        sellerInfo = {
          id: seller.id,
          businessName: seller.business_name,
          storeSlug: seller.store_slug,
          status: seller.status,
        };
      }
    }

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
      sellerId: sellerInfo ? sellerInfo.id : null,
    };

    const accessToken = generateAccessToken(payload);
    const rawRefreshToken = generateSecureToken(40);
    const refreshTokenHash = hashToken(rawRefreshToken);
    const refreshExpiresAt = new Date(
      Date.now() + PlatformPolicies.REFRESH_TOKEN_TTL_SECONDS * 1000,
    );

    await this.tokenRepo.createRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshExpiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isVerified: user.is_verified,
        seller: sellerInfo,
      },
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  /**
   * Performs atomic single-use refresh token rotation
   */
  async refresh({ rawRefreshToken }) {
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const oldTokenHash = hashToken(rawRefreshToken);
    const newRawRefreshToken = generateSecureToken(40);
    const newTokenHash = hashToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + PlatformPolicies.REFRESH_TOKEN_TTL_SECONDS * 1000);

    const rotationResult = await this.tokenRepo.rotateRefreshToken({
      oldTokenHash,
      newTokenHash,
      newExpiresAt,
    });

    if (!rotationResult) {
      throw new UnauthorizedError('Refresh token is invalid, expired, or already used');
    }

    const { user } = rotationResult;
    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
      sellerId: user.seller ? user.seller.id : null,
    };

    const accessToken = generateAccessToken(payload);

    return {
      accessToken,
      newRefreshToken: newRawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Revokes a refresh token session
   */
  async logout({ rawRefreshToken }) {
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await this.tokenRepo.revokeRefreshToken(tokenHash);
    }
    return { message: 'Successfully logged out' };
  }

  /**
   * Anti-enumeration forgot password request
   */
  async forgotPassword({ email }) {
    const genericResponse = {
      message: 'If that email exists in our system, password reset instructions have been sent.',
    };

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      return genericResponse;
    }

    const resetToken = generateSecureOtp(6);
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15m

    await this.tokenRepo.createVerificationToken({
      userId: user.id,
      tokenHash,
      type: 'PASSWORD_RESET',
      expiresAt,
    });

    return {
      ...genericResponse,
      resetToken, // for testing
    };
  }

  /**
   * Resets password using token and revokes all active refresh tokens for the user
   */
  async resetPassword({ email, token, newPassword }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestError('Invalid reset request');
    }

    const tokenRecord = await this.tokenRepo.findLatestVerificationToken(user.id, 'PASSWORD_RESET');

    if (!tokenRecord) {
      throw new BadRequestError('No active password reset request found');
    }

    if (tokenRecord.expires_at < new Date()) {
      throw new BadRequestError('Password reset code has expired');
    }

    if (tokenRecord.attempt_count >= 5) {
      throw new ForbiddenError('Too many failed attempts. Please request a new password reset.');
    }

    await this.tokenRepo.incrementAttemptCount(tokenRecord.id);

    const inputHash = hashToken(token);
    if (inputHash !== tokenRecord.token_hash) {
      throw new BadRequestError('Invalid password reset code');
    }

    const newPasswordHash = await hashPassword(newPassword);

    await this.db.$transaction(async (tx) => {
      // Mark reset token used
      await tx.verificationToken.update({
        where: { id: tokenRecord.id },
        data: { used_at: new Date() },
      });
      // Update password
      await tx.user.update({
        where: { id: user.id },
        data: { password_hash: newPasswordHash },
      });
      // Revoke all refresh tokens for this user
      await tx.refreshToken.updateMany({
        where: { user_id: user.id, is_revoked: false },
        data: { is_revoked: true },
      });
    });

    return {
      message: 'Password has been successfully reset. Please log in with your new password.',
    };
  }
}
