import express from 'express';
import controller from '../controllers/brandController';
import { validate } from '../middlewares/validateMiddleware';
import { createBrandSchema, updateBrandSchema } from '../validators/brandValidator';

const router = express.Router();

// GET /api/v1/brands - Get all brands with pagination
router.get('/', controller.getAllBrands);

// GET /api/v1/brands/:id - Get brand by ID
router.get('/:id', controller.getBrandById);

// POST /api/v1/brands - Create new brand
router.post('/create', validate(createBrandSchema), controller.createBrand);

// PUT /api/v1/brands/:id - Update brand
router.put('/update/:id', validate(updateBrandSchema), controller.updateBrand);

// DELETE /api/v1/brands/:id - Delete brand
router.delete('/hard-delete/:id', controller.hardDeleteBrand);

router.delete('/delete/:id', controller.softDeleteBrand)

export default router;