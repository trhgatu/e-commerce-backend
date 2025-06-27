import express from 'express';
import controller from './color.controller';
import { validate, createLog, protect } from '@middlewares';
import { createColorSchema, updateColorSchema } from './color.validator';
import { LogAction } from '@common/models';
const router = express.Router();

router.get('/', controller.getAllColors);

router.get('/:id', controller.getColorById);

router.post(
  '/create',
  protect,
  validate(createColorSchema),
  createLog(LogAction.CREATE, 'Color'),
  controller.createColor
);

router.put(
  '/update/:id',
  protect,
  validate(updateColorSchema),
  createLog(LogAction.UPDATE, 'Color'),
  controller.updateColor
);

router.delete('/hard-delete/:id', controller.hardDeleteColor);

router.delete(
  '/delete/:id',
  protect,
  createLog(LogAction.DELETE, 'Color'),
  controller.softDeleteColor
);

router.put('/restore/:id', controller.restoreColor);

export default router;
