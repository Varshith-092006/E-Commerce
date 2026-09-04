import { Router } from 'express';
import { requireAuth, requireRole, Roles } from '@ecommerce/shared';

import {
  AdminDashboardController,
  adminDashboardController as defaultController,
} from '../controllers/admin-dashboard.controller.js';

export function createAdminDashboardRouter({ controller = null, getRedisClient = null } = {}) {
  const router = Router();
  const ctrl =
    controller ||
    (getRedisClient
      ? new AdminDashboardController({ getRedis: getRedisClient })
      : defaultController);

  // Enforce ADMIN role access control
  const requireAdmin = [requireAuth, requireRole(Roles.ADMIN, 'ADMIN')];

  // Executive Dashboard KPIs & Summary
  router.get('/dashboard/stats', requireAdmin, ctrl.getDashboardStats);
  router.get('/dashboard/summary', requireAdmin, ctrl.getDashboardStats);
  router.get('/dashboard/kpis', requireAdmin, ctrl.getDashboardStats);

  // Platform Audit Trail
  router.get('/audit-logs', requireAdmin, ctrl.getAuditLogs);

  return router;
}

export const adminDashboardRouter = createAdminDashboardRouter();
