import express from 'express';
import controller from '../controllers/voucherController';
import { validate } from '../middlewares/validateMiddleware';
import { createVoucherSchema } from '../validators/voucherValidator';

const router = express.Router();

// --- ADMIN ROUTES ---
router.get('/', controller.getAllVouchers);

router.get('/:id', controller.getVoucherById);

router.post('/create', validate(createVoucherSchema), controller.createVoucher);

router.put('/update/:id', controller.updateVoucher);

router.delete('/delete/:id', controller.softDeleteVoucher);

router.patch('/restore/:id', controller.restoreVoucher);

router.delete('/hard-delete/:id', controller.hardDeleteVoucher);

// --- USER ROUTE ---
router.post('/validate', controller.validateVoucherUsage);

export default router;
