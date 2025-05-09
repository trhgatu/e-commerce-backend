import express from 'express';
import controller from '../controllers/categoryController';

const router = express.Router();

// GET /api/v1/categories - Get all categories with pagination
router.get('/', controller.getAllCategories);

// GET /api/v1/categories/:id - Get category by ID
router.get('/:id', controller.getCategoryById);

// POST /api/v1/categories - Create new category
router.post('/create', controller.createCategory);

// PUT /api/v1/categories/:id - Update category
router.put('/update/:id', controller.updateCategory);

// DELETE /api/v1/categories/:id - Delete category
router.delete('/delete/:id', controller.deleteCategory);

export default router;