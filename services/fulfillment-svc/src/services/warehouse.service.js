import {
  ValidationError,
  NotFoundError,
  ConflictError,
  buildPaginationMeta,
} from '@ecommerce/shared';

import { warehouseRepository as defaultWarehouseRepo } from '../repositories/warehouse.repository.js';

export class WarehouseService {
  constructor({ warehouseRepo = defaultWarehouseRepo } = {}) {
    this.warehouseRepo = warehouseRepo;
  }

  /**
   * Creates a new warehouse after validating input and verifying unique code
   */
  async createWarehouse(input) {
    const {
      code,
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country = 'IN',
      isActive = true,
    } = input;

    if (!code || typeof code !== 'string' || !code.trim()) {
      throw new ValidationError('Warehouse code is required and must be a valid string');
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ValidationError('Warehouse name is required and must be a valid string');
    }
    if (!addressLine1 || typeof addressLine1 !== 'string' || !addressLine1.trim()) {
      throw new ValidationError('Address line 1 is required');
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      throw new ValidationError('City is required');
    }
    if (!state || typeof state !== 'string' || !state.trim()) {
      throw new ValidationError('State is required');
    }
    if (!postalCode || typeof postalCode !== 'string' || !postalCode.trim()) {
      throw new ValidationError('Postal code is required');
    }

    const formattedCode = code.trim().toUpperCase();
    const existing = await this.warehouseRepo.findByCode(formattedCode);
    if (existing) {
      throw new ConflictError(`Warehouse with code '${formattedCode}' already exists`);
    }

    return await this.warehouseRepo.createWarehouse({
      code: formattedCode,
      name: name.trim(),
      address_line1: addressLine1.trim(),
      address_line2: addressLine2 ? addressLine2.trim() : null,
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
      country: country.trim().toUpperCase(),
      is_active: isActive !== false,
    });
  }

  /**
   * Updates an existing warehouse
   */
  async updateWarehouse(id, input) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid warehouse ID is required');
    }

    const existing = await this.warehouseRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Warehouse with ID '${id}' not found`);
    }

    const updateData = {};
    if (input.name !== undefined) {
      if (!input.name || typeof input.name !== 'string') {
        throw new ValidationError('Warehouse name cannot be empty');
      }
      updateData.name = input.name.trim();
    }
    if (input.addressLine1 !== undefined) {
      if (!input.addressLine1 || typeof input.addressLine1 !== 'string') {
        throw new ValidationError('Address line 1 cannot be empty');
      }
      updateData.address_line1 = input.addressLine1.trim();
    }
    if (input.addressLine2 !== undefined) {
      updateData.address_line2 = input.addressLine2 ? input.addressLine2.trim() : null;
    }
    if (input.city !== undefined) {
      if (!input.city || typeof input.city !== 'string') {
        throw new ValidationError('City cannot be empty');
      }
      updateData.city = input.city.trim();
    }
    if (input.state !== undefined) {
      if (!input.state || typeof input.state !== 'string') {
        throw new ValidationError('State cannot be empty');
      }
      updateData.state = input.state.trim();
    }
    if (input.postalCode !== undefined) {
      if (!input.postalCode || typeof input.postalCode !== 'string') {
        throw new ValidationError('Postal code cannot be empty');
      }
      updateData.postal_code = input.postalCode.trim();
    }
    if (input.country !== undefined) {
      updateData.country = input.country.trim().toUpperCase();
    }
    if (input.isActive !== undefined) {
      updateData.is_active = Boolean(input.isActive);
    }

    return await this.warehouseRepo.updateWarehouse(id, updateData);
  }

  /**
   * Retrieves a warehouse by ID
   */
  async getWarehouseById(id) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Valid warehouse ID is required');
    }

    const warehouse = await this.warehouseRepo.findById(id);
    if (!warehouse) {
      throw new NotFoundError(`Warehouse with ID '${id}' not found`);
    }
    return warehouse;
  }

  /**
   * Lists warehouses with filtering and pagination
   */
  async listWarehouses({ isActive, postalCode, city, state, page = 1, limit = 20 } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    let activeFilter = undefined;
    if (isActive === 'true' || isActive === true) {
      activeFilter = true;
    }
    if (isActive === 'false' || isActive === false) {
      activeFilter = false;
    }

    const { items, total } = await this.warehouseRepo.findMany({
      is_active: activeFilter,
      postal_code: postalCode,
      city,
      state,
      skip,
      take: limitNum,
    });

    return {
      warehouses: items,
      ...buildPaginationMeta({ page: pageNum, limit: limitNum, total }),
    };
  }
}

export const warehouseService = new WarehouseService();
