import express from 'express';

import controller from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/me', protect, controller.getCurrentUser);
router.post('/create', controller.createUser);
router.put('/update/:id', controller.updateUser)
export default router;
