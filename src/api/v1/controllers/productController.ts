import { Request, Response } from 'express';
import * as productService from '../services/productService';
import { IProduct } from '../models/productModel';

// Định nghĩa type cho controller để TypeScript nhận diện đúng
interface ProductController {
    getAllProducts: (req: Request, res: Response) => Promise<void>;
    getProductById: (req: Request, res: Response) => Promise<void>;
    createProduct: (req: Request, res: Response) => Promise<void>;
    updateProduct: (req: Request, res: Response) => Promise<void>;
    deleteProduct: (req: Request, res: Response) => Promise<void>;
}

const controller: ProductController = {
    // GET /api/v1/products - Get all products with pagination
    getAllProducts: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { products, total } = await productService.getProducts(page, limit);

            res.status(200).json({
                data: products,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    },

    // GET /api/v1/products/:id - Get product by ID
    getProductById: async (req: Request, res: Response) => {
        try {
            const product = await productService.getProductById(req.params.id);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    },

    // POST /api/v1/products - Create new product
    createProduct: async (req: Request, res: Response) => {
        try {
            const { name, price, description, images, thumbnail } = req.body;

            // Basic validation
            if (!name || !price) {
                res.status(400).json({ error: 'Name and price are required' });
                return;
            }

            const product = await productService.createProduct({ name, price, description, images, thumbnail });
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create product' });
        }
    },

    // PUT /api/v1/products/:id - Update product
    updateProduct: async (req: Request, res: Response) => {
        try {
            const { name, price, description, images, thumbnail } = req.body;

            // Basic validation
            if (!name || !price) {
                res.status(400).json({ error: 'Name and price are required' });
                return;
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
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update product' });
        }
    },

    // DELETE /api/v1/products/:id - Delete product
    deleteProduct: async (req: Request, res: Response) => {
        try {
            const product = await productService.deleteProduct(req.params.id);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    },
};

export default controller;