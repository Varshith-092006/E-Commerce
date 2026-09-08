import {
  parseCursorPagination,
  buildCursorPaginationMeta,
  parsePagination,
  buildPaginationMeta,
} from '@ecommerce/shared';

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
   * Queries audit logs with pagination and filters.
   * Supports both keyset cursor pagination and standard offset pagination.
   */
  async findMany({
    page = null,
    limit = 20,
    cursor = null,
    service = null,
    eventType = null,
    actorId = null,
    actorEmail = null,
    traceId = null,
    requestId = null,
    fromDate = null,
    toDate = null,
  }) {
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

    // Keyset cursor pagination path (no offset, deterministic ordering)
    const shouldUseCursor =
      (cursor !== undefined && cursor !== null) ||
      page === undefined ||
      page === null ||
      page === '';

    if (shouldUseCursor) {
      const { cursor: decodedCursor, limit: limitNum } = parseCursorPagination(
        { cursor, limit },
        { defaultLimit: 20, maxLimit: 100 },
      );

      if (decodedCursor) {
        where.AND = where.AND || [];
        where.AND.push({
          OR: [
            { created_at: { lt: new Date(decodedCursor.createdAt) } },
            {
              created_at: new Date(decodedCursor.createdAt),
              id: { lt: decodedCursor.id },
            },
          ],
        });
      }

      const items = await this.db.auditLog.findMany({
        where,
        orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
        take: limitNum + 1,
      });

      return buildCursorPaginationMeta({
        items,
        limit: limitNum,
        getCursorFn: (item) => ({
          id: item.id,
          createdAt: item.created_at ? new Date(item.created_at).toISOString() : null,
        }),
      });
    }

    // Standard offset pagination fallback
    const {
      page: pageNum,
      limit: limitNum,
      skip,
    } = parsePagination({ page, limit }, { defaultLimit: 20, maxLimit: 100 });

    const [items, total] = await Promise.all([
      this.db.auditLog.findMany({
        where,
        orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
        skip,
        take: limitNum,
      }),
      this.db.auditLog.count({ where }),
    ]);

    const meta = buildPaginationMeta({ page: pageNum, limit: limitNum, total });

    return {
      items,
      pagination: meta.pagination,
    };
  }
}

export const auditLogRepository = new AuditLogRepository();
