import { NotFoundError, ForbiddenError, BadRequestError } from '@ecommerce/shared';

import { AddressRepository } from '../repositories/address-repository.js';

export class AddressService {
  constructor({ addressRepo = new AddressRepository() } = {}) {
    this.addressRepo = addressRepo;
  }

  async listUserAddresses(userId) {
    return await this.addressRepo.findByUserId(userId);
  }

  async getAddressById(id) {
    const address = await this.addressRepo.findById(id);
    if (!address) {
      throw new NotFoundError('Address not found');
    }
    return address;
  }

  async createAddress(userId, data) {
    if (
      !data.fullName ||
      !data.phone ||
      !data.streetAddress ||
      !data.city ||
      !data.state ||
      !data.postalCode
    ) {
      throw new BadRequestError(
        'All address fields are required (fullName, phone, streetAddress, city, state, postalCode)',
      );
    }

    return await this.addressRepo.create(userId, data);
  }

  async updateAddress(id, userId, data) {
    const existing = await this.addressRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('Address not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You are not authorized to modify this address');
    }

    return this.addressRepo.update(id, userId, data);
  }

  async deleteAddress(id, userId) {
    const existing = await this.addressRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('Address not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You are not authorized to delete this address');
    }

    return this.addressRepo.delete(id, userId);
  }
}
