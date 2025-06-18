import { Request, Response } from 'express';
import * as categoryService from './category.service';
import { handleError, buildCommonQuery } from '@common/utils';

const controller = {
  // Get all categories with pagination
  getAllCategories: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { filters, sort } = buildCommonQuery(req, ["name"]);

      const result = await categoryService.getAllCategories(
        page,
        limit,
        filters,
        sort
      );

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Categories fetched successfully',
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch categories', 400);
    }
  },

  // Get category by ID
  getCategoryById: async (req: Request, res: Response) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Category not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Category fetched successfully',
        data: category,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch category', 400);
    }
  },

  // Create new category
  createCategory: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new Error('User ID is missing from request');
      const categoryData = req.body;

      if (!categoryData.parentId) {
        categoryData.parentId = null;
      }

      const category = await categoryService.createCategory(categoryData, userId);

      res.locals.targetId = category._id?.toString() || '';
      res.locals.description = `Created category: ${category.name}`;

      res.status(201).json({
        success: true,
        code: 201,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create category', 400);
    }
  },

  // Update category
  updateCategory: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new Error('User ID is missing from request');
      const categoryData = req.body;
      const category = await categoryService.updateCategory(req.params.id, categoryData, userId);

      if (!category) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Category not found',
        });
        return;
      }

      res.locals.targetId = category._id?.toString();
      res.locals.description = `Updated category: ${category.name}`;

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update category', 400);
    }
  },

  // Delete category
  hardDeleteCategory: async (req: Request, res: Response) => {
    try {
      const category = await categoryService.hardDeleteCategory(req.params.id);
      if (!category) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Category not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete category', 400);
    }
  },
  softDeleteCategory: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new Error('User ID is missing from request');
      const category = await categoryService.softDeleteCategory(req.params.id, userId);
      if (!category) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Category not found',
        });
        return;
      }
res.locals.targetId = category._id?.toString();
      res.locals.description = `Deleted category: ${category.name}`
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete category', 400);
    }
  },
  restoreCategory: async (req: Request, res: Response) => {
    try {
      const category = await categoryService.restoreCategory(req.params.id);
      if (!category) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Category not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Category restored successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to restore category', 400);
    }
  },

  // Get category tree (nested structure)
  getCategoryTree: async (req: Request, res: Response) => {
    try {
      const categoryTree = await categoryService.getCategoryTree();
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Category tree fetched successfully',
        data: categoryTree,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch category tree', 400);
    }
  },
};

export default controller;
