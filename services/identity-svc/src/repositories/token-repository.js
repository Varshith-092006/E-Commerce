import { prisma } from '../lib/prisma.js';

export class TokenRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  // --- Refresh Token Operations ---

  async createRefreshToken({ userId, tokenHash, expiresAt }) {
    return await this.db.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
        is_revoked: false,
      },
    });
  }

  async findRefreshToken(tokenHash) {
    return await this.db.refreshToken.findUnique({
      where: { token_hash: tokenHash },
      include: { user: { include: { seller: true } } },
    });
  }

  /**
   * Atomically rotates a refresh token:
   * 1. Finds and revokes the old token record if active.
   * 2. Creates the new token record.
   * If the old token is already revoked or missing, the transaction returns null/fails (concurrency guard).
   */
  async rotateRefreshToken({ oldTokenHash, newTokenHash, newExpiresAt }) {
    return await this.db.$transaction(async (tx) => {
      const existing = await tx.refreshToken.findUnique({
        where: { token_hash: oldTokenHash },
        include: { user: { include: { seller: true } } },
      });

      if (!existing || existing.is_revoked || existing.expires_at < new Date()) {
        return null;
      }

      // Revoke old token
      await tx.refreshToken.update({
        where: { id: existing.id },
        data: { is_revoked: true },
      });

      // Create new token record
      const created = await tx.refreshToken.create({
        data: {
          user_id: existing.user_id,
          token_hash: newTokenHash,
          expires_at: newExpiresAt,
          is_revoked: false,
        },
      });

      return {
        oldToken: existing,
        newToken: created,
        user: existing.user,
      };
    });
  }

  async revokeRefreshToken(tokenHash) {
    return await this.db.refreshToken.updateMany({
      where: { token_hash: tokenHash, is_revoked: false },
      data: { is_revoked: true },
    });
  }

  async revokeAllUserRefreshTokens(userId) {
    return await this.db.refreshToken.updateMany({
      where: { user_id: userId, is_revoked: false },
      data: { is_revoked: true },
    });
  }

  // --- Verification & Reset Token Operations ---

  async createVerificationToken({ userId, tokenHash, type, expiresAt }) {
    return await this.db.verificationToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        type,
        expires_at: expiresAt,
        attempt_count: 0,
        resend_count: 0,
        last_sent_at: new Date(),
      },
    });
  }

  async findLatestVerificationToken(userId, type) {
    return await this.db.verificationToken.findFirst({
      where: { user_id: userId, type, used_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  async incrementAttemptCount(id) {
    return await this.db.verificationToken.update({
      where: { id },
      data: { attempt_count: { increment: 1 } },
    });
  }

  async updateResend(id, tokenHash, expiresAt) {
    return await this.db.verificationToken.update({
      where: { id },
      data: {
        token_hash: tokenHash,
        expires_at: expiresAt,
        resend_count: { increment: 1 },
        last_sent_at: new Date(),
        attempt_count: 0,
      },
    });
  }

  async markTokenUsed(id) {
    return await this.db.verificationToken.update({
      where: { id },
      data: { used_at: new Date() },
    });
  }
}
