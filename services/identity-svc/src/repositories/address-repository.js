import { prisma } from '../lib/prisma.js';

export class AddressRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  async findById(id) {
    return await this.db.address.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId) {
    return await this.db.address.findMany({
      where: { user_id: userId },
      orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
    });
  }

  async create(userId, data) {
    return await this.db.$transaction(async (tx) => {
      // Check if user currently has any addresses
      const count = await tx.address.count({ where: { user_id: userId } });
      const shouldBeDefault = data.isDefault || count === 0;

      if (shouldBeDefault) {
        // Clear previous default
        await tx.address.updateMany({
          where: { user_id: userId, is_default: true },
          data: { is_default: false },
        });
      }

      return await tx.address.create({
        data: {
          user_id: userId,
          full_name: data.fullName,
          phone: data.phone,
          street_address: data.streetAddress,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          country: data.country || 'India',
          is_default: shouldBeDefault,
        },
      });
    });
  }

  async update(id, userId, data) {
    return await this.db.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { user_id: userId, is_default: true },
          data: { is_default: false },
        });
      }

      return await tx.address.update({
        where: { id },
        data: {
          ...(data.fullName !== undefined && { full_name: data.fullName }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.streetAddress !== undefined && { street_address: data.streetAddress }),
          ...(data.city !== undefined && { city: data.city }),
          ...(data.state !== undefined && { state: data.state }),
          ...(data.postalCode !== undefined && { postal_code: data.postalCode }),
          ...(data.country !== undefined && { country: data.country }),
          ...(data.isDefault !== undefined && { is_default: data.isDefault }),
        },
      });
    });
  }

  async delete(id, userId) {
    return await this.db.$transaction(async (tx) => {
      const address = await tx.address.findUnique({ where: { id } });
      if (!address || address.user_id !== userId) {
        return null;
      }

      const wasDefault = address.is_default;
      await tx.address.delete({ where: { id } });

      // If deleted address was default, promote a remaining address if any exists
      if (wasDefault) {
        const remaining = await tx.address.findFirst({
          where: { user_id: userId },
          orderBy: { created_at: 'desc' },
        });

        if (remaining) {
          await tx.address.update({
            where: { id: remaining.id },
            data: { is_default: true },
          });
        }
      }

      return address;
    });
  }
}
