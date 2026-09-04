import { prisma } from '../lib/prisma.js';

export class SellerRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  async findById(id) {
    return await this.db.seller.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId) {
    return await this.db.seller.findUnique({
      where: { user_id: userId },
      include: { user: true },
    });
  }

  async findBySlug(storeSlug) {
    return await this.db.seller.findUnique({
      where: { store_slug: storeSlug.toLowerCase().trim() },
    });
  }

  async create(data) {
    return await this.db.seller.create({
      data: {
        user_id: data.userId,
        business_name: data.businessName,
        store_slug: data.storeSlug.toLowerCase().trim(),
        gstin: data.gstin || null,
        pan: data.pan || null,
        business_address: data.businessAddress || null,
        status: data.status || 'PENDING',
      },
    });
  }

  async updateProfile(userId, data) {
    return await this.db.seller.update({
      where: { user_id: userId },
      data: {
        ...(data.businessName !== undefined && { business_name: data.businessName }),
        ...(data.businessAddress !== undefined && { business_address: data.businessAddress }),
        ...(data.gstin !== undefined && { gstin: data.gstin }),
        ...(data.pan !== undefined && { pan: data.pan }),
      },
    });
  }

  async updateStatus(id, status, rejectionReason = null) {
    return await this.db.seller.update({
      where: { id },
      data: {
        status,
        rejection_reason: rejectionReason,
      },
      include: { user: true },
    });
  }

  async listAll({ status, skip = 0, limit = 20 } = {}) {
    const where = status ? { status } : {};
    const [sellers, total] = await Promise.all([
      this.db.seller.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              phone: true,
            },
          },
        },
      }),
      this.db.seller.count({ where }),
    ]);

    return { sellers, total };
  }
}
