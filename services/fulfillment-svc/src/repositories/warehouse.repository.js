import { prisma as defaultPrisma } from '../lib/prisma.js';

export class WarehouseRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Creates a new warehouse
   */
  async createWarehouse(
    {
      code,
      name,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country = 'IN',
      is_active = true,
    },
    tx = this.prisma,
  ) {
    return await tx.warehouse.create({
      data: {
        code,
        name,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_active,
      },
    });
  }

  /**
   * Updates an existing warehouse by ID
   */
  async updateWarehouse(id, data, tx = this.prisma) {
    return await tx.warehouse.update({
      where: { id },
      data,
    });
  }

  /**
   * Finds a warehouse by ID
   */
  async findById(id, tx = this.prisma) {
    return await tx.warehouse.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a warehouse by code
   */
  async findByCode(code, tx = this.prisma) {
    return await tx.warehouse.findUnique({
      where: { code },
    });
  }

  /**
   * Finds warehouses by filter with pagination
   */
  async findMany(
    { is_active, postal_code, city, state, skip = 0, take = 50 } = {},
    tx = this.prisma,
  ) {
    const where = {};
    if (typeof is_active === 'boolean') {
      where.is_active = is_active;
    }
    if (postal_code) {
      where.postal_code = postal_code;
    }
    if (city) {
      where.city = city;
    }
    if (state) {
      where.state = state;
    }

    const [items, total] = await Promise.all([
      tx.warehouse.findMany({
        where,
        orderBy: { code: 'asc' },
        skip,
        take,
      }),
      tx.warehouse.count({ where }),
    ]);

    return { items, total };
  }
}

export const warehouseRepository = new WarehouseRepository();
