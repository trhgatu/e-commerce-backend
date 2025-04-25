import express from 'express';
import controller from '../controllers/productController';

const router = express.Router();

// GET /api/v1/products - Get all products with pagination
router.get('/', controller.getAllProducts);

// GET /api/v1/products/:id - Get product by ID
router.get('/:id', controller.getProductById);

// POST /api/v1/products - Create new product
router.post('/create', controller.createProduct);

// PUT /api/v1/products/:id - Update product
router.put('/update/:id', controller.updateProduct);

// DELETE /api/v1/products/:id - Delete product
router.delete('/delete/:id', controller.deleteProduct);

export default router;