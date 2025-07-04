import express from 'express';
import controller from './product.controller';
import { createProductSchema, updateProductSchema } from './product.validator';
import { LogAction } from '@common/models';
import { protect, validate, createLog } from '@middlewares';

const router = express.Router();

router.get('/', controller.getAllProducts);

router.get('/:id', controller.getProductById);

router.post(
  '/create',
  protect,
  validate(createProductSchema),
  createLog(LogAction.CREATE, 'Product'),
  controller.createProduct
);

router.put(
  '/update/:id',
  protect,
  validate(updateProductSchema),
  createLog(LogAction.UPDATE, 'Product'),
  controller.updateProduct
);

router.delete('/hard-delete/:id', controller.hardDeleteProduct);

router.delete(
  '/delete/:id',
  protect,
  createLog(LogAction.DELETE, 'Product'),
  controller.softDeleteProduct
);

router.put(
  '/restore/:id',
  protect,
  createLog(LogAction.RESTORE, 'Product'),
  controller.restoreProduct
);

export default router;
