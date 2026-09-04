import { jest } from '@jest/globals';
import { AddressService } from '../../src/services/address-service.js';
import { ForbiddenError, BadRequestError } from '@ecommerce/shared';

describe('AddressService Unit Tests', () => {
  let addressService;
  let mockAddressRepo;

  beforeEach(() => {
    mockAddressRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    addressService = new AddressService({ addressRepo: mockAddressRepo });
  });

  it('should validate required address fields upon creation', async () => {
    await expect(
      addressService.createAddress('user-1', { fullName: 'John Doe' }),
    ).rejects.toThrow(BadRequestError);
  });

  it('should enforce ownership on address update', async () => {
    mockAddressRepo.findById.mockResolvedValue({
      id: 'addr-1',
      user_id: 'user-other',
    });

    await expect(
      addressService.updateAddress('addr-1', 'user-current', { city: 'Bangalore' }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('should enforce ownership on address deletion', async () => {
    mockAddressRepo.findById.mockResolvedValue({
      id: 'addr-1',
      user_id: 'user-other',
    });

    await expect(
      addressService.deleteAddress('addr-1', 'user-current'),
    ).rejects.toThrow(ForbiddenError);
  });
});
