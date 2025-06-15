import express from 'express';
import controller from '../controllers/categoryController';
import { validate } from '../middlewares/validateMiddleware';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator';
import { protect } from '../middlewares/authMiddleware';
import { createLog } from '../middlewares/logMiddleware';
import Log, { LogAction } from '../models/logModel';

const router = express.Router();

router.get('/', controller.getAllCategories);

router.get('/:id', controller.getCategoryById);

router.get('/category-tree', controller.getCategoryTree)

router.post(
    '/create',
    protect,
    validate(createCategorySchema),
    createLog(LogAction.CREATE, 'Category'),
    controller.createCategory);

router.put(
    '/update/:id',
    protect,
    validate(updateCategorySchema),
    createLog(LogAction.UPDATE, 'Category'),
    controller.updateCategory);


router.delete('/hard-delete/:id', controller.hardDeleteCategory);


router.delete(
    '/delete/:id',
    protect,
    createLog(LogAction.DELETE, 'Category'),
    controller.softDeleteCategory
)

export default router;