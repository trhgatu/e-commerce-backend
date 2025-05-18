import express from 'express';
import controller from '../controllers/colorController';
import { validate } from '../middlewares/validateMiddleware';
import { createColorSchema, updateColorSchema } from '../validators/colorValidator';

const router = express.Router();

router.get('/', controller.getAllColors);

router.get('/:id', controller.getColorById);

router.post('/create', validate(createColorSchema), controller.createColor);

router.put('/update/:id', validate(updateColorSchema), controller.updateColor);

router.delete('/hard-delete/:id', controller.hardDeleteColor);

router.delete('/delete/:id', controller.softDeleteColor);

router.put('/restore/:id', controller.restoreColor);

export default router;