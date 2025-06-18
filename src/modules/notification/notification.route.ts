import express from 'express';
import controller from './notification.controller';
import { LogAction } from '@common/models';
import { protect, validate, createLog } from '@middlewares';

const router = express.Router();

router.get('/', controller.getAllNotifications);

router.get('/read/:id', controller.markAsRead);

router.patch('/read-all', protect, controller.markAllAsRead);

//Admin Route
router.post('/create/', controller.createNotification);

export default router;