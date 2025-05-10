import express from 'express';
import controller from '../controllers/brandController';

const router = express.Router();

// GET /api/v1/categories - Get all categories with pagination
router.get('/', controller.getAllBrands);

// GET /api/v1/categories/:id - Get category by ID
router.get('/:id', controller.getBrandById);

// POST /api/v1/categories - Create new category
router.post('/create', controller.createBrand);

// PUT /api/v1/categories/:id - Update category
router.put('/update/:id', controller.updateBrand);

// DELETE /api/v1/categories/:id - Delete category
router.delete('/delete/:id', controller.deleteBrand);

export default router;