import { successResponse } from '@ecommerce/shared';

import { AuditLogRepository } from '../repositories/audit-log.repository.js';

/**
 * Audit Log Controller — identity-svc
 *
 * Provides ADMIN-only access to the audit trail.
 * Supports pagination and filtering by service, eventType, actor, traceId, requestId.
 */
export class AuditLogController {
  constructor({ auditRepo = new AuditLogRepository() } = {}) {
    this.auditRepo = auditRepo;
  }

  /**
   * GET /api/v1/users/admin/audit-logs
   * ADMIN only — paginated audit log with multi-field filters
   */
  getAuditLogs = async (req, res, next) => {
    try {
      const {
        page = null,
        limit = 20,
        cursor = null,
        service = null,
        eventType = null,
        actorId = null,
        actorEmail = null,
        traceId = null,
        requestId = null,
        from = null,
        to = null,
      } = req.query;

      const result = await this.auditRepo.findMany({
        page,
        limit,
        cursor,
        service,
        eventType,
        actorId,
        actorEmail,
        traceId,
        requestId,
        fromDate: from,
        toDate: to,
      });

      return res.status(200).json(
        successResponse({
          data: result.items.map((log) => ({
            id: log.id,
            actorId: log.actor_id,
            actorRole: log.actor_role,
            actorEmail: log.actor_email,
            service: log.service,
            eventType: log.event_type,
            resourceType: log.resource_type,
            resourceId: log.resource_id,
            traceId: log.trace_id,
            requestId: log.request_id,
            metadata: log.metadata,
            ipAddress: log.ip_address,
            timestamp: log.created_at,
          })),
          extraMeta: { pagination: result.pagination },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}

export const auditLogController = new AuditLogController();
