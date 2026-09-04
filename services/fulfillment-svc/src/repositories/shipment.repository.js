import { prisma as defaultPrisma } from '../lib/prisma.js';

export class ShipmentRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Creates a shipment along with its items and initial tracking update within transaction
   */
  async createShipmentWithItems(
    {
      shipment_number,
      order_id,
      user_id,
      warehouse_id,
      reservation_id = null,
      status = 'ALLOCATED',
      courier_code = 'INTERNAL_FLEET',
      shipping_address,
      estimated_delivery = null,
      items = [],
      initial_tracking_description = 'Shipment created and allocated to warehouse',
    },
    tx = this.prisma,
  ) {
    return await tx.shipment.create({
      data: {
        shipment_number,
        order_id,
        user_id,
        warehouse_id,
        reservation_id,
        status,
        courier_code,
        shipping_address,
        estimated_delivery,
        items: {
          create: items.map((item) => ({
            product_id: item.product_id,
            sku: item.sku,
            seller_id: item.seller_id || null,
            quantity: item.quantity,
            unit_price: item.unit_price !== undefined ? item.unit_price : null,
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
   * Finds a shipment by ID with sorted tracking updates
   */
  async findById(id, tx = this.prisma) {
    return await tx.shipment.findUnique({
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
   * Finds a shipment by unique shipment number
   */
  async findByShipmentNumber(shipment_number, tx = this.prisma) {
    return await tx.shipment.findUnique({
      where: { shipment_number },
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
   * Finds a shipment by unique tracking number
   */
  async findByTrackingNumber(tracking_number, tx = this.prisma) {
    return await tx.shipment.findUnique({
      where: { tracking_number },
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
   * Finds all shipments for a specific order
   */
  async findByOrderId(order_id, tx = this.prisma) {
    return await tx.shipment.findMany({
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
   * Finds all shipments referencing a reservation ID (to prevent double allocation)
   */
  async findByReservationId(reservation_id, tx = this.prisma) {
    return await tx.shipment.findMany({
      where: { reservation_id },
      include: {
        warehouse: true,
        items: true,
      },
    });
  }

  /**
   * Updates shipment details and status
   */
  async updateShipmentStatus(id, updateData, tx = this.prisma) {
    return await tx.shipment.update({
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
   * Appends a new tracking update checkpoint
   */
  async addTrackingUpdate(
    {
      shipment_id,
      status,
      location = null,
      description,
      recorded_by = null,
      recorded_at = new Date(),
    },
    tx = this.prisma,
  ) {
    return await tx.trackingUpdate.create({
      data: {
        shipment_id,
        status,
        location,
        description,
        recorded_by,
        recorded_at,
      },
    });
  }

  /**
   * Queries shipments with filtering and pagination
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
      tx.shipment.findMany({
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
      tx.shipment.count({ where }),
    ]);

    return { items, total };
  }
}

export const shipmentRepository = new ShipmentRepository();
