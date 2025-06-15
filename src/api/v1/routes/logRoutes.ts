import express from 'express';
import controller from '../controllers/logController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', /* protect, */ controller.getAllLogs);

router.get('/:id', /* protect, */ controller.getLogById);

router.delete('/:id', /* protect, */ controller.deleteLog);

router.delete('/', /* protect, */ controller.clearAllLogs);

export default router;
