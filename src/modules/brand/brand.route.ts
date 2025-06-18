import express from 'express';
import controller from './brand.controller';
import { validate } from '@middlewares';
import { createBrandSchema, updateBrandSchema } from './brand.validator';

const router = express.Router();

router.get('/', controller.getAllBrands);

router.get('/:id', controller.getBrandById);

router.post('/create', validate(createBrandSchema), controller.createBrand);

router.put('/update/:id', validate(updateBrandSchema), controller.updateBrand);

router.delete('/hard-delete/:id', controller.hardDeleteBrand);

router.delete('/delete/:id', controller.softDeleteBrand)

export default router;