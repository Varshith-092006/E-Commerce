import { jest } from '@jest/globals';
import { SellerService } from '../../src/services/seller-service.js';
import { BadRequestError, SellerStatus } from '@ecommerce/shared';

describe('SellerService Unit Tests', () => {
  let sellerService;
  let mockSellerRepo;

  beforeEach(() => {
    mockSellerRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      updateProfile: jest.fn(),
      updateStatus: jest.fn(),
      listAll: jest.fn(),
    };
    sellerService = new SellerService({ sellerRepo: mockSellerRepo });
  });

  describe('updateSellerProfile', () => {
    it('should update allowed business fields for authenticated seller', async () => {
      mockSellerRepo.findByUserId.mockResolvedValue({
        id: 'seller-1',
        user_id: 'user-1',
      });
      mockSellerRepo.updateProfile.mockResolvedValue({
        id: 'seller-1',
        business_name: 'New Name',
      });

      const updated = await sellerService.updateSellerProfile('user-1', {
        businessName: 'New Name',
        gstin: '29ABCDE1234F1Z5',
      });

      expect(updated.business_name).toBe('New Name');
      expect(mockSellerRepo.updateProfile).toHaveBeenCalledWith('user-1', {
        businessName: 'New Name',
        businessAddress: undefined,
        gstin: '29ABCDE1234F1Z5',
        pan: undefined,
      });
    });
  });

  describe('updateSellerStatusByAdmin', () => {
    it('should transition status to ACTIVE upon admin approval', async () => {
      mockSellerRepo.findById.mockResolvedValue({
        id: 'seller-1',
        status: SellerStatus.PENDING,
      });
      mockSellerRepo.updateStatus.mockResolvedValue({
        id: 'seller-1',
        status: SellerStatus.ACTIVE,
      });

      const result = await sellerService.updateSellerStatusByAdmin('seller-1', {
        status: SellerStatus.ACTIVE,
      });

      expect(result.status).toBe(SellerStatus.ACTIVE);
      expect(mockSellerRepo.updateStatus).toHaveBeenCalledWith('seller-1', SellerStatus.ACTIVE, null);
    });

    it('should reject invalid seller status transition', async () => {
      await expect(
        sellerService.updateSellerStatusByAdmin('seller-1', { status: 'APPROVED' }), // APPROVED is not an allowed enum
      ).rejects.toThrow(BadRequestError);
    });
  });
});
