import { Request, Response } from 'express';
import * as productService from '../services/productService';
import { handleError } from '../utils/handleError';
import { createProductSchema } from '../validators/productValidator';

const controller = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await productService.getProducts(page, limit);

      res.status(200).json({
        data: result.data,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
    } catch (error) {
      handleError(res, error, 'Failed to fetch products');
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return
      }
      res.status(200).json(product);
    } catch (error) {
      handleError(res, error, 'Failed to fetch product');
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const parsed = createProductSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.errors
        })
      }
      const productData = parsed.data;
      if (!productData) {
        res.status(400).json({ error: 'Invalid product data' });
        return;
      }
      const product = await productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      handleError(res, error, 'Failed to create product', 400);
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const { name, price, description, images, thumbnail } = req.body;

      if (!name || !price) {
        res.status(400).json({ error: 'Name and price are required' });
        return
      }

      const product = await productService.updateProduct(req.params.id, {
        name,
        price,
        description,
        images,
        thumbnail,
      });

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return
      }

      res.status(200).json(product);
    } catch (error) {
      handleError(res, error, 'Failed to update product', 400);
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    try {
      const product = await productService.deleteProduct(req.params.id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error, 'Failed to delete product');
    }
  },
};

export default controller;
