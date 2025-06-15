import express from 'express';
import controller from '../controllers/productController';
import { validate } from '../middlewares/validateMiddleware';
import { createProductSchema, updateProductSchema } from '../validators/productValidator';
import { createLog } from '../middlewares/logMiddleware';
import { LogAction } from '../models/logModel';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', controller.getAllProducts);

router.get('/:id', controller.getProductById);

router.post(
  '/create',
  protect,
  validate(createProductSchema),
  createLog(LogAction.CREATE, 'Product'),
  controller.createProduct,
);


router.put(
  '/update/:id',
  protect,
  validate(updateProductSchema),
  createLog(LogAction.UPDATE, 'Product'),
  controller.updateProduct
);

router.delete('/hard-delete/:id', controller.hardDeleteProduct);

router.delete('/delete/:id', controller.softDeleteProduct);

router.put('/restore/:id', controller.restoreProduct);

export default router;