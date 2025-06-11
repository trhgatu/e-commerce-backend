import express from 'express';
import controller from '../controllers/productController';
import { validate } from '../middlewares/validateMiddleware';
import { createProductSchema, updateProductSchema } from '../validators/productValidator';

const router = express.Router();

router.get('/', controller.getAllProducts);

router.get('/:id', controller.getProductById);

router.post('/create', validate(createProductSchema), controller.createProduct);

router.put('/update/:id', validate(updateProductSchema), controller.updateProduct);

router.delete('/hard-delete/:id', controller.hardDeleteProduct);

router.delete('/delete/:id', controller.softDeleteProduct);

router.put('/restore/:id', controller.restoreProduct);

export default router;