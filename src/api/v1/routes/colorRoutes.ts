import express from 'express';
import controller from '../controllers/colorController';
import { validate } from '../middlewares/validateMiddleware';
import { createColorSchema, updateColorSchema } from '../validators/colorValidator';
import { createLog } from '../middlewares/logMiddleware';
import Log, { LogAction } from '../models/logModel';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', controller.getAllColors);

router.get('/:id', controller.getColorById);

router.post('/create',
    protect,
    validate(createColorSchema),
    createLog(LogAction.CREATE, "Color"),
    controller.createColor
);

router.put('/update/:id',
    protect,
    validate(updateColorSchema),
    createLog(LogAction.UPDATE, 'Color'),
    controller.updateColor
);

router.delete('/hard-delete/:id', controller.hardDeleteColor);

router.delete('/delete/:id',
    protect,
    createLog(LogAction.DELETE, 'Color'),
    controller.softDeleteColor
);

router.put('/restore/:id', controller.restoreColor);

export default router;