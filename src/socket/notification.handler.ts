import { getIO } from './index';
import { NotificationType } from '@modules/notification/notification.model';

export const emitNotification = (
  userId: string,
  data: {
    title: string;
    content: string;
    type: NotificationType;
    metadata?: Record<string, any>;
  }
) => {
  getIO().to(userId).emit('notification:new', data);
};

// Optionally register listeners here too
export const registerNotificationHandler = (socket: any) => {
  // socket.on('markAllAsReadRealtime', ...)
};
