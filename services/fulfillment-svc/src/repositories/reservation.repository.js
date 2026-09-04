import { prisma as defaultPrisma } from '../lib/prisma.js';

export class ReservationRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Creates a new reservation along with its items
   */
  async createReservation(
    { reservation_key, user_id, order_id, status = 'HELD', expires_at, items = [] },
    tx = this.prisma,
  ) {
    return await tx.inventoryReservation.create({
      data: {
        reservation_key,
        user_id,
        order_id,
        status,
        expires_at,
        items: {
          create: items.map((item) => ({
            inventory_item_id: item.inventory_item_id,
            product_id: item.product_id,
            sku: item.sku,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            inventory_item: {
              include: { warehouse: true },
            },
          },
        },
      },
    });
  }

  /**
   * Finds a reservation by reservation key
   */
  async findByReservationKey(reservation_key, tx = this.prisma) {
    return await tx.inventoryReservation.findUnique({
      where: { reservation_key },
      include: {
        items: {
          include: {
            inventory_item: {
              include: { warehouse: true },
            },
          },
        },
      },
    });
  }

  /**
   * Finds a reservation by ID
   */
  async findById(id, tx = this.prisma) {
    return await tx.inventoryReservation.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            inventory_item: {
              include: { warehouse: true },
            },
          },
        },
      },
    });
  }

  /**
   * Finds expired reservations currently in HELD status
   */
  async findExpiredHeldReservations(cutoffDate = new Date(), limit = 100, tx = this.prisma) {
    return await tx.inventoryReservation.findMany({
      where: {
        status: 'HELD',
        expires_at: { lte: cutoffDate },
      },
      include: {
        items: {
          include: {
            inventory_item: true,
          },
        },
      },
      orderBy: { expires_at: 'asc' },
      take: limit,
    });
  }

  /**
   * Updates reservation to COMMITTED
   */
  async commitReservation(id, committed_at = new Date(), tx = this.prisma) {
    return await tx.inventoryReservation.update({
      where: { id },
      data: {
        status: 'COMMITTED',
        committed_at,
      },
      include: {
        items: {
          include: {
            inventory_item: true,
          },
        },
      },
    });
  }

  /**
   * Updates reservation to RELEASED
   */
  async releaseReservation(id, released_at = new Date(), tx = this.prisma) {
    return await tx.inventoryReservation.update({
      where: { id },
      data: {
        status: 'RELEASED',
        released_at,
      },
      include: {
        items: {
          include: {
            inventory_item: true,
          },
        },
      },
    });
  }

  /**
   * Updates reservation to EXPIRED
   */
  async expireReservation(id, expired_at = new Date(), tx = this.prisma) {
    return await tx.inventoryReservation.update({
      where: { id },
      data: {
        status: 'EXPIRED',
        expired_at,
      },
      include: {
        items: {
          include: {
            inventory_item: true,
          },
        },
      },
    });
  }
}

export const reservationRepository = new ReservationRepository();
