import { prisma as defaultPrisma } from '../lib/prisma.js';

export class OrderStatusHistoryRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Append-only: Creates a new status history entry
   */
  async createHistoryEntry(
    { orderId, fromStatus, toStatus, changedBy, actorRole, reason = null },
    tx = this.prisma,
  ) {
    const entry = await tx.orderStatusHistory.create({
      data: {
        order_id: orderId,
        from_status: fromStatus,
        to_status: toStatus,
        changed_by: changedBy,
        actor_role: actorRole,
        reason,
      },
    });
    return entry;
  }

  /**
   * Reads status history for an order, ordered chronologically ascending
   */
  async findByOrderId(orderId, tx = this.prisma) {
    const history = await tx.orderStatusHistory.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: 'asc' },
    });
    return history;
  }
}

export const orderStatusHistoryRepository = new OrderStatusHistoryRepository();
