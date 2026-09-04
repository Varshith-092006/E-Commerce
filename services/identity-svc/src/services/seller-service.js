import { NotFoundError, BadRequestError, SellerStatus } from '@ecommerce/shared';

import { SellerRepository } from '../repositories/seller-repository.js';

export class SellerService {
  constructor({ sellerRepo = new SellerRepository() } = {}) {
    this.sellerRepo = sellerRepo;
  }

  async getSellerProfile(userId) {
    const seller = await this.sellerRepo.findByUserId(userId);
    if (!seller) {
      throw new NotFoundError('Seller profile not found');
    }
    return seller;
  }

  async updateSellerProfile(userId, { businessName, businessAddress, gstin, pan }) {
    const seller = await this.sellerRepo.findByUserId(userId);
    if (!seller) {
      throw new NotFoundError('Seller profile not found');
    }

    return this.sellerRepo.updateProfile(userId, {
      businessName,
      businessAddress,
      gstin,
      pan,
    });
  }

  async listSellersForAdmin({ status, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    return await this.sellerRepo.listAll({ status, skip, limit });
  }

  async updateSellerStatusByAdmin(sellerId, { status, rejectionReason }) {
    // Robust normalization: trim and uppercase to handle 'active', 'ACTIVE', 'Approved', etc.
    const rawStatus = typeof status === 'string' ? status.trim().toUpperCase() : status;
    const targetStatus = rawStatus;

    const validStatuses = Object.values(SellerStatus);
    if (!validStatuses.includes(targetStatus)) {
      throw new BadRequestError(`Invalid seller status. Allowed: ${validStatuses.join(', ')}`);
    }

    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }

    return this.sellerRepo.updateStatus(
      sellerId,
      targetStatus,
      targetStatus === SellerStatus.REJECTED ? rejectionReason : null,
    );
  }
}
