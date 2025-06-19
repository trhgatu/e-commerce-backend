import express from 'express';
import controller from './category.controller';
import {
    createCategorySchema,
    updateCategorySchema
} from './category.validator';
import { createLog, validate, protect } from '@middlewares';
import { LogAction } from '@common/models';

const router = express.Router();

router.get('/', controller.getAllCategories);

router.get('/:id', controller.getCategoryById);

router.get('/category-tree', controller.getCategoryTree)

router.post(
    '/create',
    protect,
    validate(createCategorySchema),
    createLog(LogAction.CREATE, 'Category'),
    controller.createCategory
);

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

router.put(
    '/restore/:id',
    protect,
    createLog(LogAction.RESTORE, 'Category'),
    controller.restoreCategory
)

export default router;