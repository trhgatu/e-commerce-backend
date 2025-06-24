import express from 'express';
import controller from './notification.controller';
import { LogAction } from '@common/models';
import { protect, /* validate, */ createLog } from '@middlewares';
/* import { logAction } from '@common/services/log.service'; */

const router = express.Router();

router.get('/', protect, controller.getAllNotifications);

router.patch(
    '/read/:id',
    protect,
    createLog(LogAction.READ, 'Notification'),
    controller.markAsRead
);

router.patch('/read-all',
    protect,
    createLog(LogAction.READ_ALL, 'Notification'),
    controller.markAllAsRead
);
//Admin Route
router.post('/create/',
    protect,
    createLog(LogAction.CREATE, 'Notification'),
    controller.createNotification
);

export default router;