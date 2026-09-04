import { prisma as defaultPrisma } from '../lib/prisma.js';

export class IdempotencyRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  async findByKey(userId, idempotencyKey, tx = this.prisma) {
    const record = await tx.idempotencyRecord.findUnique({
      where: {
        user_id_idempotency_key: {
          user_id: userId,
          idempotency_key: idempotencyKey,
        },
      },
    });
    return record;
  }

  async createRecord({ userId, idempotencyKey, requestHash }, tx = this.prisma) {
    const record = await tx.idempotencyRecord.create({
      data: {
        user_id: userId,
        idempotency_key: idempotencyKey,
        request_hash: requestHash,
        status: 'IN_PROGRESS',
      },
    });
    return record;
  }

  async markCompleted({ userId, idempotencyKey, orderId, responsePayload }, tx = this.prisma) {
    const record = await tx.idempotencyRecord.update({
      where: {
        user_id_idempotency_key: {
          user_id: userId,
          idempotency_key: idempotencyKey,
        },
      },
      data: {
        status: 'COMPLETED',
        order_id: orderId,
        response_payload: responsePayload,
        completed_at: new Date(),
      },
    });
    return record;
  }

  async markFailed({ userId, idempotencyKey }, tx = this.prisma) {
    const result = await tx.idempotencyRecord
      .delete({
        where: {
          user_id_idempotency_key: {
            user_id: userId,
            idempotency_key: idempotencyKey,
          },
        },
      })
      .catch(() => null);
    return result;
  }
}

export const idempotencyRepository = new IdempotencyRepository();
