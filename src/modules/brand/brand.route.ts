import express from 'express';
import controller from './brand.controller';
import { createLog, protect, validate } from '@middlewares';
import { createBrandSchema, updateBrandSchema } from './brand.validator';
import { LogAction } from '@common/models';

const router = express.Router();

router.get('/', controller.getAllBrands);

router.get('/:id', controller.getBrandById);

router.post(
    '/create',
    protect,
    validate(createBrandSchema),
    createLog(LogAction.CREATE, 'Brand'),
    controller.createBrand
);

router.put(
    '/update/:id',
    protect,
    validate(updateBrandSchema),
    createLog(LogAction.UPDATE, 'Brand'),
    controller.updateBrand
);

router.delete(
    '/hard-delete/:id',
    protect,
    controller.hardDeleteBrand
);

router.delete(
    '/delete/:id',
    protect,
    createLog(LogAction.DELETE, 'Brand'),
    controller.softDeleteBrand
)

export default router;