import { jest } from '@jest/globals';
import { ProductService } from '../../src/services/product-service.js';
import { ForbiddenError, NotFoundError, ConflictError } from '@ecommerce/shared';

describe('ProductService Unit Tests', () => {
  let productService;
  let mockProductRepo;
  let mockCategoryRepo;

  beforeEach(() => {
    mockProductRepo = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findBySku: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      browse: jest.fn(),
      search: jest.fn(),
      autocomplete: jest.fn(),
    };
    mockCategoryRepo = {
      findById: jest.fn(),
    };

    productService = new ProductService({
      productRepo: mockProductRepo,
      categoryRepo: mockCategoryRepo,
    });
  });

  describe('createProduct', () => {
    it('should create product when category exists and slug is unique', async () => {
      mockCategoryRepo.findById.mockResolvedValue({ id: 'cat-1' });
      mockProductRepo.findBySlug.mockResolvedValue(null);
      mockProductRepo.findBySku.mockResolvedValue(null);
      mockProductRepo.create.mockResolvedValue({
        id: 'prod-1',
        title: 'Pro Laptop',
        slug: 'pro-laptop',
        price: 999.99,
      });

      const product = await productService.createProduct('seller-1', {
        categoryId: 'cat-1',
        title: 'Pro Laptop',
        slug: 'pro-laptop',
        sku: 'SKU-001',
        price: 999.99,
        brand: 'TechCorp',
        description: 'High performance laptop',
      });

      expect(product.id).toBe('prod-1');
      expect(mockProductRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sellerId: 'seller-1',
          title: 'Pro Laptop',
        }),
      );
    });
  });

  describe('Product Ownership Isolation', () => {
    it('should forbid Seller A from updating Seller B product', async () => {
      mockProductRepo.findById.mockResolvedValue({
        id: 'prod-1',
        seller_id: 'seller-b',
      });

      await expect(
        productService.updateProduct('prod-1', 'seller-a', { title: 'Hacked Title' }),
      ).rejects.toThrow(ForbiddenError);
    });

    it('should forbid Seller A from deleting Seller B product', async () => {
      mockProductRepo.findById.mockResolvedValue({
        id: 'prod-1',
        seller_id: 'seller-b',
      });

      await expect(
        productService.deleteProduct('prod-1', 'seller-a'),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('getProductDetails', () => {
    it('should return product details with reviews summary placeholder', async () => {
      mockProductRepo.findBySlug.mockResolvedValue({
        id: 'prod-1',
        title: 'Phone',
        slug: 'phone',
        average_rating: '4.50',
        total_reviews: 12,
      });

      const details = await productService.getProductDetails('phone');
      expect(details.title).toBe('Phone');
      expect(details.reviews_summary.average_rating).toBe(4.5);
      expect(details.reviews_summary.total_reviews).toBe(12);
      expect(details.reviews_summary.recent_reviews).toEqual([]);
    });
  });
});
