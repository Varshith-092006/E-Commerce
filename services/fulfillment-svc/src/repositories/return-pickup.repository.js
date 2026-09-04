import { prisma as defaultPrisma } from '../lib/prisma.js';

export class ReturnPickupRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Creates a return pickup record with items and initial tracking entry within transaction
   */
  async createReturnPickup(
    {
      return_number,
      order_id,
      user_id,
      warehouse_id,
      status = 'REQUESTED',
      courier_code = 'INTERNAL_FLEET',
      return_tracking_number = null,
      pickup_address,
      scheduled_pickup_date = null,
      items = [],
      initial_tracking_description = 'Return pickup requested by customer',
    },
    tx = this.prisma,
  ) {
    return await tx.returnPickup.create({
      data: {
        return_number,
        order_id,
        user_id,
        warehouse_id,
        status,
        courier_code,
        return_tracking_number,
        pickup_address,
        scheduled_pickup_date,
        items: {
          create: items.map((item) => ({
            product_id: item.product_id,
            sku: item.sku,
            seller_id: item.seller_id || null,
            quantity: item.quantity,
            reason: item.reason,
          })),
        },
        tracking_updates: {
          create: [
            {
              status,
              description: initial_tracking_description,
            },
          ],
        },
      },
      include: {
        warehouse: true,
        items: true,
        tracking_updates: {
          orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }],
        },
      },
    });
  }

  /**
   * Finds a return pickup by ID
   */
  async findById(id, tx = this.prisma) {
    return await tx.returnPickup.findUnique({
      where: { id },
      include: {
        warehouse: true,
        items: true,
        tracking_updates: {
          orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }],
        },
      },
    });
  }

  /**
   * Finds a return pickup by unique return number
   */
  async findByReturnNumber(return_number, tx = this.prisma) {
    return await tx.returnPickup.findUnique({
      where: { return_number },
      include: {
        warehouse: true,
        items: true,
        tracking_updates: {
          orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }],
        },
      },
    });
  }

  /**
   * Finds a return pickup by tracking number
   */
  async findByTrackingNumber(return_tracking_number, tx = this.prisma) {
    return await tx.returnPickup.findUnique({
      where: { return_tracking_number },
      include: {
        warehouse: true,
        items: true,
        tracking_updates: {
          orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }],
        },
      },
    });
  }

  /**
   * Finds all return pickups for an order
   */
  async findByOrderId(order_id, tx = this.prisma) {
    return await tx.returnPickup.findMany({
      where: { order_id },
      include: {
        warehouse: true,
        items: true,
        tracking_updates: {
          orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }],
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  /**
   * Updates return pickup details, status, timestamps, or POP metadata
   */
  async updateReturnStatus(id, updateData, tx = this.prisma) {
    return await tx.returnPickup.update({
      where: { id },
      data: updateData,
      include: {
        warehouse: true,
        items: true,
        tracking_updates: {
          orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }],
        },
      },
    });
  }

  /**
   * Updates QC inspection results on a specific return item
   */
  async updateItemInspection(
    itemId,
    { inspection_grade, inspection_notes, is_restocked, restocked_at },
    tx = this.prisma,
  ) {
    return await tx.returnItem.update({
      where: { id: itemId },
      data: {
        inspection_grade,
        inspection_notes,
        is_restocked: is_restocked !== undefined ? is_restocked : false,
        restocked_at: restocked_at || null,
      },
    });
  }

  /**
   * Appends a reverse logistics tracking update
   */
  async addTrackingUpdate(
    {
      return_pickup_id,
      status,
      location = null,
      description,
      recorded_by = null,
      recorded_at = new Date(),
    },
    tx = this.prisma,
  ) {
    return await tx.returnTrackingUpdate.create({
      data: {
        return_pickup_id,
        status,
        location,
        description,
        recorded_by,
        recorded_at,
      },
    });
  }

  /**
   * Queries return pickups with filters and pagination
   */
  async findMany(
    {
      status,
      courier_code,
      order_id,
      user_id,
      warehouse_id,
      seller_id,
      from_date,
      to_date,
      skip = 0,
      take = 20,
    } = {},
    tx = this.prisma,
  ) {
    const where = {};
    if (status) {
      where.status = status;
    }
    if (courier_code) {
      where.courier_code = courier_code;
    }
    if (order_id) {
      where.order_id = order_id;
    }
    if (user_id) {
      where.user_id = user_id;
    }
    if (warehouse_id) {
      where.warehouse_id = warehouse_id;
    }
    if (seller_id) {
      where.items = {
        some: { seller_id },
      };
    }
    if (from_date || to_date) {
      where.created_at = {};
      if (from_date) {
        where.created_at.gte = new Date(from_date);
      }
      if (to_date) {
        where.created_at.lte = new Date(to_date);
      }
    }

    const [items, total] = await Promise.all([
      tx.returnPickup.findMany({
        where,
        include: {
          warehouse: true,
          items: true,
          tracking_updates: {
            orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }],
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      tx.returnPickup.count({ where }),
    ]);

    return { items, total };
  }
}

export const returnPickupRepository = new ReturnPickupRepository();
