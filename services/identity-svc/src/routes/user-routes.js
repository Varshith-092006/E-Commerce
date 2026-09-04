import { Router } from 'express';
import { authenticate, requireAdmin } from '@ecommerce/shared';

import { UserController } from '../controllers/user-controller.js';
import { AdminUserController } from '../controllers/admin-user.controller.js';
import { AuditLogController } from '../controllers/audit-log.controller.js';

export function createUserRoutes(
  userController = new UserController(),
  adminUserController = new AdminUserController(),
  auditLogController = new AuditLogController(),
) {
  const router = Router();

  router.use(authenticate);

  // ── Admin-only management routes (must be before generic user routes) ──────
  router.get('/admin/summary', requireAdmin, adminUserController.getAdminSummary);
  router.get('/admin/list', requireAdmin, adminUserController.listUsers);
  router.patch('/admin/:id/role', requireAdmin, adminUserController.assignRole);

  // ── Admin audit logs (proxied from gateway, accessible here directly) ──────
  router.get('/admin/audit-logs', requireAdmin, auditLogController.getAuditLogs);

  // ── Authenticated user self-service routes ────────────────────────────────
  router.get('/me', userController.getMe);
  router.put('/me', userController.updateMe);

  router.get('/addresses', userController.listAddresses);
  router.get('/addresses/:id', userController.getAddressById);
  router.post('/addresses', userController.createAddress);
  router.put('/addresses/:id', userController.updateAddress);
  router.delete('/addresses/:id', userController.deleteAddress);

  return router;
}
