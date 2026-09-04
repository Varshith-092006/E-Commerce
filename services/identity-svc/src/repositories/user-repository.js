import { prisma } from '../lib/prisma.js';

export class UserRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  async findById(id) {
    return await this.db.user.findUnique({
      where: { id },
      include: { seller: true },
    });
  }

  async findByEmail(email) {
    return await this.db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { seller: true },
    });
  }

  async create(data) {
    return await this.db.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        phone: data.phone || null,
        password_hash: data.passwordHash,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role || 'CUSTOMER',
        is_verified: data.isVerified || false,
      },
    });
  }

  async update(id, data) {
    return await this.db.user.update({
      where: { id },
      data,
    });
  }

  async setVerified(id, isVerified = true) {
    return await this.db.user.update({
      where: { id },
      data: { is_verified: isVerified },
    });
  }

  async updatePassword(id, passwordHash) {
    return await this.db.user.update({
      where: { id },
      data: { password_hash: passwordHash },
    });
  }
}
