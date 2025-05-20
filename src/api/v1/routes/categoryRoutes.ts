import express from 'express';
import controller from '../controllers/categoryController';
import { validate } from '../middlewares/validateMiddleware';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator';

const router = express.Router();

router.get('/', controller.getAllCategories);

router.get('/:id', controller.getCategoryById);

router.get('/category-tree', controller.getCategoryTree)

router.post('/create', validate(createCategorySchema), controller.createCategory);

router.put('/update/:id', validate(updateCategorySchema), controller.updateCategory);

router.delete('/delete/:id', controller.deleteCategory);

export default router;