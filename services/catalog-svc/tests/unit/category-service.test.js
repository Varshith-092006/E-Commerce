import { jest } from '@jest/globals';
import { CategoryService } from '../../src/services/category-service.js';
import { ConflictError, NotFoundError } from '@ecommerce/shared';

describe('CategoryService Unit Tests', () => {
  let categoryService;
  let mockCategoryRepo;

  beforeEach(() => {
    mockCategoryRepo = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    categoryService = new CategoryService(mockCategoryRepo);
  });

  describe('getCategoryTree', () => {
    it('should assemble flat list of categories into hierarchical tree', async () => {
      mockCategoryRepo.findAll.mockResolvedValue([
        { id: 'cat-root', name: 'Electronics', slug: 'electronics', parent_id: null },
        { id: 'cat-child', name: 'Laptops', slug: 'laptops', parent_id: 'cat-root' },
      ]);

      const tree = await categoryService.getCategoryTree();
      expect(tree).toHaveLength(1);
      expect(tree[0].id).toBe('cat-root');
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].id).toBe('cat-child');
    });
  });

  describe('createCategory', () => {
    it('should reject duplicate category slug with ConflictError', async () => {
      mockCategoryRepo.findBySlug.mockResolvedValue({ id: 'existing-cat' });

      await expect(
        categoryService.createCategory({ name: 'Audio', slug: 'audio' }),
      ).rejects.toThrow(ConflictError);
    });
  });
});
