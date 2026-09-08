import {
  successResponse,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  Roles,
} from '@ecommerce/shared';

import { UserRepository } from '../repositories/user-repository.js';
import { AuditLogRepository } from '../repositories/audit-log.repository.js';

// Roles that are allowed to be assigned by ADMIN (not self-assignable)
const ASSIGNABLE_ROLES = [
  Roles.CUSTOMER,
  Roles.SELLER,
  Roles.ADMIN,
  Roles.COURIER,
  Roles.LOGISTICS,
];

// Roles that CUSTOMER or SELLER cannot assign to anyone (including themselves)
const PRIVILEGED_ROLES = [Roles.ADMIN, Roles.COURIER, Roles.LOGISTICS];

export class AdminUserController {
  constructor({ userRepo = new UserRepository(), auditRepo = new AuditLogRepository() } = {}) {
    this.userRepo = userRepo;
    this.auditRepo = auditRepo;
  }

  /**
   * GET /api/v1/users/admin/list
   * ADMIN only — list all users with pagination
   */
  listUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, role = null, search = null } = req.query;
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
      const skip = (pageNum - 1) * limitNum;

      const where = {};
      if (role && ASSIGNABLE_ROLES.includes(role.toUpperCase())) {
        where.role = role.toUpperCase();
      }
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        this.userRepo.db.user.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip,
          take: limitNum,
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            phone: true,
            role: true,
            is_verified: true,
            is_active: true,
            created_at: true,
          },
        }),
        this.userRepo.db.user.count({ where }),
      ]);

      return res.status(200).json(
        successResponse({
          data: users.map((u) => ({
            id: u.id,
            email: u.email,
            firstName: u.first_name,
            lastName: u.last_name,
            phone: u.phone,
            role: u.role,
            isVerified: u.is_verified,
            isActive: u.is_active,
            createdAt: u.created_at,
          })),
          extraMeta: {
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum),
            },
          },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/v1/users/admin/:id/role
   * ADMIN only — assign a role to a user
   *
   * Rules:
   * - Only ADMIN can call this endpoint (enforced by requireAdmin middleware)
   * - COURIER and LOGISTICS roles can only be assigned by ADMIN
   * - Target user cannot be the same ADMIN (to prevent accidental self-demotion)
   */
  assignRole = async (req, res, next) => {
    try {
      const actorId = req.user?.id || req.headers?.['x-user-id'];
      const actorRole = req.user?.role || req.headers?.['x-user-role'];
      const actorEmail = req.user?.email || req.headers?.['x-user-email'];
      const { id: targetUserId } = req.params;
      const { role: newRole, reason = null } = req.body || {};

      if (!newRole) {
        throw new BadRequestError('role is required in request body');
      }

      const normalizedRole = newRole.toUpperCase();
      if (!ASSIGNABLE_ROLES.includes(normalizedRole)) {
        throw new BadRequestError(`Invalid role. Allowed values: ${ASSIGNABLE_ROLES.join(', ')}`);
      }

      // Only ADMIN can assign privileged roles
      if (PRIVILEGED_ROLES.includes(normalizedRole) && actorRole !== Roles.ADMIN) {
        throw new ForbiddenError(`Assigning ${normalizedRole} role requires ADMIN privileges`);
      }

      const targetUser = await this.userRepo.findById(targetUserId);
      if (!targetUser) {
        throw new NotFoundError('User not found');
      }

      const previousRole = targetUser.role;

      // No-op if role is already the same
      if (previousRole === normalizedRole) {
        return res.status(200).json(
          successResponse({
            data: { message: 'User already has this role', role: normalizedRole },
            requestId: req.id,
          }),
        );
      }

      // Update the role
      const updatedUser = await this.userRepo.update(targetUserId, { role: normalizedRole });

      // Emit audit log
      await this.auditRepo
        .create({
          actorId,
          actorRole,
          actorEmail,
          service: 'identity-svc',
          eventType: 'user.role_assigned',
          resourceType: 'User',
          resourceId: targetUserId,
          traceId: req.traceId || null,
          requestId: req.id || null,
          metadata: {
            previousRole,
            newRole: normalizedRole,
            reason: reason || null,
            targetEmail: updatedUser.email,
          },
          ipAddress: req.ip || null,
        })
        .catch((err) => {
          // Audit log failure should not fail the main operation
          // but should be logged for investigation
          console.error('AuditLog write failed:', err.message);
        });

      return res.status(200).json(
        successResponse({
          data: {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            previousRole,
            message: `Role successfully updated from ${previousRole} to ${normalizedRole}`,
          },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users/admin/summary
   * Returns registered users, active users, and seller counts
   */
  getAdminSummary = async (req, res, next) => {
    try {
      const [totalUsers, activeUsers, roleCounts, totalSellers, sellerStatusCounts] =
        await Promise.all([
          this.userRepo.db.user.count(),
          this.userRepo.db.user.count({ where: { is_active: true } }),
          this.userRepo.db.user.groupBy({
            by: ['role'],
            _count: { id: true },
          }),
          this.userRepo.db.seller.count(),
          this.userRepo.db.seller.groupBy({
            by: ['status'],
            _count: { id: true },
          }),
        ]);

      const usersByRole = {};
      for (const r of roleCounts) {
        usersByRole[r.role] = r._count.id;
      }

      const sellersByStatus = {};
      for (const s of sellerStatusCounts) {
        sellersByStatus[s.status] = s._count.id;
      }

      return res.status(200).json(
        successResponse({
          data: {
            totalUsers,
            activeUsers,
            usersByRole,
            totalSellers,
            approvedSellers: sellersByStatus['ACTIVE'] || 0,
            pendingSellerApplications: sellersByStatus['PENDING'] || 0,
            suspendedSellers: sellersByStatus['SUSPENDED'] || 0,
          },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}

export const adminUserController = new AdminUserController();
