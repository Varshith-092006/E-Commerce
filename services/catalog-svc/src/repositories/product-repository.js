import { prisma } from '../lib/prisma.js';

export class ProductRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  async findById(id) {
    return await this.db.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { display_order: 'asc' } },
      },
    });
  }

  async findBySlug(slug) {
    if (!slug) {
      return null;
    }
    return await this.db.product.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      include: {
        category: true,
        images: { orderBy: { display_order: 'asc' } },
      },
    });
  }

  async findBySku(sku) {
    return await this.db.product.findUnique({
      where: { sku: sku.trim() },
    });
  }

  async create(data) {
    return await this.db.product.create({
      data: {
        seller_id: data.sellerId,
        category_id: data.categoryId,
        title: data.title.trim(),
        slug: data.slug.toLowerCase().trim(),
        description: data.description.trim(),
        brand: data.brand.trim(),
        sku: data.sku.trim(),
        price: data.price,
        compare_at_price: data.compareAtPrice || null,
        status: data.status || 'DRAFT',
        is_available: data.isAvailable !== undefined ? data.isAvailable : true,
        attributes: data.attributes || {},
      },
      include: { category: true, images: true },
    });
  }

  async update(id, data) {
    return await this.db.product.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.slug !== undefined && { slug: data.slug.toLowerCase().trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.brand !== undefined && { brand: data.brand.trim() }),
        ...(data.categoryId !== undefined && { category_id: data.categoryId }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.compareAtPrice !== undefined && { compare_at_price: data.compareAtPrice }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.isAvailable !== undefined && { is_available: data.isAvailable }),
        ...(data.attributes !== undefined && { attributes: data.attributes }),
      },
      include: { category: true, images: true },
    });
  }

  async delete(id) {
    return await this.db.product.delete({
      where: { id },
    });
  }

  async listSellerProducts(sellerId, { skip = 0, limit = 20 } = {}) {
    const where = { seller_id: sellerId };
    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { category: true, images: true },
      }),
      this.db.product.count({ where }),
    ]);

    return { products, total };
  }

  async browse({
    categoryId,
    minPrice,
    maxPrice,
    brand,
    minRating,
    inStock,
    sort = 'newest',
    skip = 0,
    limit = 20,
  } = {}) {
    const where = {
      status: 'PUBLISHED',
      ...(categoryId && { category_id: categoryId }),
      ...(brand && { brand: { equals: brand, mode: 'insensitive' } }),
      ...(inStock !== undefined && { is_available: inStock }),
      ...(minRating && { average_rating: { gte: minRating } }),
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      };
    }

    let orderBy = { created_at: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating_desc') {
      orderBy = { average_rating: 'desc' };
    }

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { category: true, images: true },
      }),
      this.db.product.count({ where }),
    ]);

    return { products, total };
  }

  async search({ query, skip = 0, limit = 20 } = {}) {
    if (!query || !query.trim()) {
      return { products: [], total: 0 };
    }

    const cleanQuery = query.trim();

    try {
      const products = await this.db.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: cleanQuery, mode: 'insensitive' } },
            { brand: { contains: cleanQuery, mode: 'insensitive' } },
            { description: { contains: cleanQuery, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        orderBy: { average_rating: 'desc' },
        include: { category: true, images: true },
      });

      const total = await this.db.product.count({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: cleanQuery, mode: 'insensitive' } },
            { brand: { contains: cleanQuery, mode: 'insensitive' } },
            { description: { contains: cleanQuery, mode: 'insensitive' } },
          ],
        },
      });

      return { products, total };
    } catch {
      return { products: [], total: 0 };
    }
  }

  async autocomplete({ prefix, limit = 10 } = {}) {
    if (!prefix || !prefix.trim()) {
      return [];
    }

    const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (!sanitizedPrefix) {
      return [];
    }

    const products = await this.db.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { startsWith: sanitizedPrefix, mode: 'insensitive' } },
          { brand: { startsWith: sanitizedPrefix, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        brand: true,
        price: true,
      },
    });

    return products;
  }

  async addImage(productId, { url, publicId, altText, displayOrder, isThumbnail }) {
    return await this.db.productImage.create({
      data: {
        product_id: productId,
        url,
        public_id: publicId,
        alt_text: altText || null,
        display_order: displayOrder || 0,
        is_thumbnail: isThumbnail || false,
      },
    });
  }

  async deleteImage(productId, imageId) {
    return await this.db.productImage.delete({
      where: { id: imageId, product_id: productId },
    });
  }
}
