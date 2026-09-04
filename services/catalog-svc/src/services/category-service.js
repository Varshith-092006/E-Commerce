import { ConflictError, NotFoundError } from '@ecommerce/shared';

import { CategoryRepository } from '../repositories/category-repository.js';

export class CategoryService {
  constructor(categoryRepo = new CategoryRepository()) {
    this.categoryRepo = categoryRepo;
  }

  async getCategoryTree({ activeOnly = true } = {}) {
    const categories = await this.categoryRepo.findAll({ activeOnly });
    // Build hierarchical tree
    const rootCategories = categories.filter((cat) => !cat.parent_id);
    const categoryMap = new Map(categories.map((c) => [c.id, { ...c, children: [] }]));

    for (const cat of categories) {
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id).children.push(categoryMap.get(cat.id));
      }
    }

    return rootCategories.map((root) => categoryMap.get(root.id));
  }

  async createCategory(data) {
    const slug = data.slug
      ? data.slug.toLowerCase().trim()
      : (data.name || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

    const existing = await this.categoryRepo.findBySlug(slug);
    if (existing) {
      throw new ConflictError('A category with this slug already exists');
    }

    return this.categoryRepo.create({ ...data, slug });
  }

  async updateCategory(id, data) {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('Category not found');
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await this.categoryRepo.findBySlug(data.slug);
      if (slugConflict && slugConflict.id !== id) {
        throw new ConflictError('A category with this slug already exists');
      }
    }

    return this.categoryRepo.update(id, data);
  }

  async deleteCategory(id) {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('Category not found');
    }

    return this.categoryRepo.delete(id);
  }
}
