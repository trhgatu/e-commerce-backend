import express from 'express';
import controller from '../controllers/colorController';

const router = express.Router();

router.get('/', controller.getAllColors);

router.get('/:id', controller.getColorById);

router.post('/create', controller.createColor);

router.put('/update/:id', controller.updateColor);

router.delete('/hard-delete/:id', controller.hardDeleteColor);

router.delete('/delete/:id', controller.softDeleteColor);

router.put('/restore/:id', controller.restoreColor);

export default router;