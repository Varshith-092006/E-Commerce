import { prisma } from '../lib/prisma.js';

/**
 * AuditLog Repository — identity-svc
 *
 * Stores security-significant events: role assignments, logins, admin actions.
 * Does NOT store passwords, secrets, card data, or raw tokens.
 */
export class AuditLogRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  /**
   * Creates a new audit log entry
   */
  async create({
    actorId = null,
    actorRole,
    actorEmail = null,
    service,
    eventType,
    resourceType = null,
    resourceId = null,
    traceId = null,
    requestId = null,
    metadata = null,
    ipAddress = null,
  }) {
    return await this.db.auditLog.create({
      data: {
        actor_id: actorId,
        actor_role: actorRole,
        actor_email: actorEmail,
        service,
        event_type: eventType,
        resource_type: resourceType,
        resource_id: resourceId,
        trace_id: traceId,
        request_id: requestId,
        metadata: metadata || undefined,
        ip_address: ipAddress,
      },
    });
  }

  /**
   * Queries audit logs with pagination and filters
   */
  async findMany({
    page = 1,
    limit = 20,
    service = null,
    eventType = null,
    actorId = null,
    actorEmail = null,
    traceId = null,
    requestId = null,
    fromDate = null,
    toDate = null,
  }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (service) {
      where.service = service;
    }
    if (eventType) {
      where.event_type = eventType;
    }
    if (actorId) {
      where.actor_id = actorId;
    }
    if (actorEmail) {
      where.actor_email = { contains: actorEmail, mode: 'insensitive' };
    }
    if (traceId) {
      where.trace_id = traceId;
    }
    if (requestId) {
      where.request_id = requestId;
    }
    if (fromDate || toDate) {
      where.created_at = {};
      if (fromDate) {
        where.created_at.gte = new Date(fromDate);
      }
      if (toDate) {
        where.created_at.lte = new Date(toDate);
      }
    }

    const [items, total] = await Promise.all([
      this.db.auditLog.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limitNum,
      }),
      this.db.auditLog.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }
}

export const auditLogRepository = new AuditLogRepository();
