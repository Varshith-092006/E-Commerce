import { prisma } from '../lib/prisma.js';

export class CategoryRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  async findById(id) {
    return await this.db.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
  }

  async findBySlug(slug) {
    if (!slug) {
      return null;
    }
    return await this.db.category.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      include: { children: true, parent: true },
    });
  }

  async findAll({ activeOnly = true } = {}) {
    const where = activeOnly ? { is_active: true } : {};
    return await this.db.category.findMany({
      where,
      orderBy: [{ display_order: 'asc' }, { name: 'asc' }],
      include: { children: true },
    });
  }

  async create(data) {
    return await this.db.category.create({
      data: {
        name: data.name.trim(),
        slug: data.slug.toLowerCase().trim(),
        description: data.description || null,
        parent_id: data.parentId || null,
        image_url: data.imageUrl || null,
        is_active: data.isActive !== undefined ? data.isActive : true,
        display_order: data.displayOrder || 0,
      },
    });
  }

  async update(id, data) {
    return await this.db.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.slug !== undefined && { slug: data.slug.toLowerCase().trim() }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.parentId !== undefined && { parent_id: data.parentId }),
        ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
        ...(data.isActive !== undefined && { is_active: data.isActive }),
        ...(data.displayOrder !== undefined && { display_order: data.displayOrder }),
      },
    });
  }

  async delete(id) {
    return await this.db.category.delete({
      where: { id },
    });
  }
}
