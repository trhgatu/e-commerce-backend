import express from 'express';

import controller from './user.controller';
import { protect } from '@middlewares';

const router = express.Router();

router.get('/', controller.getAllUsers)

router.get('/me', protect, controller.getCurrentUser);

router.get('/:id', controller.getUserById)

router.post('/create', controller.createUser);

router.put('/update/:id', controller.updateUser);

router.delete('/hard-delete/:id', controller.hardDeleteUser);

router.delete('/delete/:id', controller.softDeleteUser)
export default router;
