import { successResponse } from '@ecommerce/shared';

import { CategoryService } from '../services/category-service.js';

export class CategoryController {
  constructor(categoryService = new CategoryService()) {
    this.categoryService = categoryService;
  }

  getTree = async (req, res, next) => {
    try {
      const activeOnly = req.query.all !== 'true';
      const tree = await this.categoryService.getCategoryTree({ activeOnly });
      return res.status(200).json(
        successResponse({
          data: tree,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      return res.status(201).json(
        successResponse({
          data: category,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);
      return res.status(200).json(
        successResponse({
          data: category,
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      return res.status(200).json(
        successResponse({
          data: { message: 'Category successfully deleted' },
          requestId: req.id,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
