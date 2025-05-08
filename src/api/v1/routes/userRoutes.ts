import express from 'express';

import controller from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/me', protect, controller.getCurrentUser);

export default router;
