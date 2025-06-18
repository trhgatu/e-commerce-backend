import express from 'express';
import { emitNotification } from '../socket/notification.handler';
import { NotificationType } from '../modules/notification/notification.model';

const router = express.Router();

console.log('🧪 test.route.ts loaded');

router.post('/test-emit', async (req, res) => {
  console.log('🔥 POST /test-emit triggered');
  const { userId } = req.body;

  emitNotification(userId, {
    title: 'Noti test từ Postman',
    content: 'Infinity vừa bắn 1 quả socket 🎯',
    type: NotificationType.SYSTEM,
    metadata: { test: true },
  });

  res.json({ success: true, message: 'Notification sent via socket' });
});

export default router;
