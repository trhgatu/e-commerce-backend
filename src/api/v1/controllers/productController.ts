import { Request, Response } from 'express';
import * as productService from '../services/productService';
import { handleError } from '../utils';
import { buildCommonQuery } from '../utils/buildCommonQuery';

const controller = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { filters, sort } = buildCommonQuery(req, ["name", "description"]);
      const result = await productService.getAllProducts(
        page,
        limit,
        filters,
        sort,
      );

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Products fetched successfully',
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch products', 400);
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Product not found',
        });
        return;
      }
      res.status(200).json({
        success: true,
        code: 200,
        message: 'Product fetched successfully',
        data: product,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch product', 400);
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const productData = req.body;
      const product = await productService.createProduct(productData);
      res.status(201).json({
        success: true,
        code: 201,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      handleError(res, error, 'Failed to create product', 400);
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const productData = req.body;
      const product = await productService.updateProduct(req.params.id, productData);

      if (!product) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      handleError(res, error, 'Failed to update product', 400);
    }
  },

  hardDeleteProduct: async (req: Request, res: Response) => {
    try {
      const product = await productService.hardDeleteProduct(req.params.id);
      if (!product) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Product deleted successfully',
        data: product
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete product', 400);
    }
  },
  softDeleteProduct: async (req: Request, res: Response) => {
    try {
      const product = await productService.softDeleteProduct(req.params.id);
      if (!product) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to delete product', 400);
    }
  },
  restoreProduct: async (req:Request, res: Response) => {
    try {
      const product = await productService.restoreProduct(req.params.id);
      if (!product) {
        res.status(404).json({
          success: false,
          code: 404,
          message: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        code: 200,
        message: 'Product restored successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to restore product', 400);
    }
  }
};

export default controller;
