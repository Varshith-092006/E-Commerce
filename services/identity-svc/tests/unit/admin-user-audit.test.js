import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AdminUserController } from '../../src/controllers/admin-user.controller.js';
import { Roles } from '@ecommerce/shared';

describe('P0-2 & P1-13 Admin User Role Assignment and Audit Logging', () => {
  let adminUserController;
  let mockUserRepo;
  let mockAuditRepo;

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      update: jest.fn(),
      db: {
        user: {
          findMany: jest.fn(),
          count: jest.fn(),
        },
      },
    };

    mockAuditRepo = {
      create: jest.fn().mockResolvedValue({ id: 'audit-001' }),
      findMany: jest.fn(),
    };

    adminUserController = new AdminUserController({
      userRepo: mockUserRepo,
      auditRepo: mockAuditRepo,
    });
  });

  it('should allow ADMIN to promote a user to COURIER and record an audit log', async () => {
    mockUserRepo.findById.mockResolvedValue({
      id: 'target-user-001',
      role: Roles.CUSTOMER,
      email: 'courier@example.com',
    });

    mockUserRepo.update.mockResolvedValue({
      id: 'target-user-001',
      role: Roles.COURIER,
      email: 'courier@example.com',
    });

    const req = {
      user: { id: 'admin-001', role: Roles.ADMIN, email: 'admin@example.com' },
      params: { id: 'target-user-001' },
      body: { role: 'COURIER', reason: 'Assigned to delivery fleet' },
      id: 'req-001',
      traceId: 'trace-001',
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await adminUserController.assignRole(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockUserRepo.update).toHaveBeenCalledWith('target-user-001', { role: Roles.COURIER });
    expect(mockAuditRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        actorRole: Roles.ADMIN,
        eventType: 'user.role_assigned',
        resourceType: 'User',
        resourceId: 'target-user-001',
      }),
    );
  });

  it('should reject non-admin assigning privileged roles', async () => {
    const req = {
      user: { id: 'seller-001', role: Roles.SELLER },
      params: { id: 'target-user-001' },
      body: { role: 'COURIER' },
    };
    const res = {};
    const next = jest.fn();

    await adminUserController.assignRole(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('requires ADMIN privileges'),
      }),
    );
  });
});
