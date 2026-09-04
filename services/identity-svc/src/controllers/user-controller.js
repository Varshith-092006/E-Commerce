import { successResponse, NotFoundError } from '@ecommerce/shared';

import { UserRepository } from '../repositories/user-repository.js';
import { AddressService } from '../services/address-service.js';

export class UserController {
  constructor(userRepo = new UserRepository(), addressService = new AddressService()) {
    this.userRepo = userRepo;
    this.addressService = addressService;
  }

  getMe = async (req, res, next) => {
    try {
      const user = await this.userRepo.findById(req.user.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return res.status(200).json(
        successResponse({
          data: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            role: user.role,
            isVerified: user.is_verified,
            seller: user.seller
              ? {
                  id: user.seller.id,
                  businessName: user.seller.business_name,
                  storeSlug: user.seller.store_slug,
                  status: user.seller.status,
                }
              : null,
          },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (req, res, next) => {
    try {
      const { firstName, lastName, phone } = req.body;
      const updated = await this.userRepo.update(req.user.id, {
        ...(firstName && { first_name: firstName }),
        ...(lastName && { last_name: lastName }),
        ...(phone && { phone }),
      });

      return res.status(200).json(
        successResponse({
          data: {
            id: updated.id,
            email: updated.email,
            firstName: updated.first_name,
            lastName: updated.last_name,
            phone: updated.phone,
            role: updated.role,
            isVerified: updated.is_verified,
          },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  listAddresses = async (req, res, next) => {
    try {
      const addresses = await this.addressService.listUserAddresses(req.user.id);
      return res.status(200).json(
        successResponse({
          data: addresses,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  getAddressById = async (req, res, next) => {
    try {
      const address = await this.addressService.getAddressById(req.params.id);
      return res.status(200).json(
        successResponse({
          data: address,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  createAddress = async (req, res, next) => {
    try {
      const address = await this.addressService.createAddress(req.user.id, req.body);
      return res.status(201).json(
        successResponse({
          data: address,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req, res, next) => {
    try {
      const address = await this.addressService.updateAddress(req.params.id, req.user.id, req.body);
      return res.status(200).json(
        successResponse({
          data: address,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (req, res, next) => {
    try {
      await this.addressService.deleteAddress(req.params.id, req.user.id);
      return res.status(200).json(
        successResponse({
          data: { message: 'Address successfully deleted' },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
