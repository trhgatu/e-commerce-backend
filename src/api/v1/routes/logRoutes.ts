import express from 'express';
import controller from '../controllers/logController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', /* protect, */ controller.getAllLogs);

router.get('/:id', /* protect, */ controller.getLogById);

router.delete('/delete/:id', /* protect, */ controller.deleteLog);

router.delete('/clear-log', /* protect, */ controller.clearAllLogs);

export default router;
