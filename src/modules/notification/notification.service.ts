import mongoose from 'mongoose';
import NotificationModel, { INotification, NotificationType } from './notification.model';
import { emitNotification } from '@socket/notification.handler';
import { paginate } from '@common/utils';
import {
  getCache,
  setCache,
  deleteCache,
  deleteKeysByPattern
} from '@shared/services/redis.service';

const isDev = process.env.NODE_ENV === 'development';

export const getAllNotifications = async (
  userId: string,
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  const finalFilters = {
    userId,
    ...filters,
  };

  const cacheKey = `notifications:${userId}:page=${page}:limit=${limit}:filters=${JSON.stringify(
    finalFilters
  )}:sort=${JSON.stringify(sort)}`;

  if (!isDev) {
    const cached = await getCache(cacheKey);
    if (cached) return cached;
  }

  const result = await paginate<INotification>(
    NotificationModel,
    { page, limit },
    finalFilters,
    sort
  );

  if (!isDev) {
    await setCache(cacheKey, result, 300);
  }

  return result;
};

export const markNotificationAsRead = async (
  notifId: string
): Promise<INotification | null> => {
  const updated = await NotificationModel.findByIdAndUpdate(
    notifId,
    { isRead: true },
    { new: true }
  ).lean();

  if (updated) {
    await deleteCache(`notifications:*`);
  }

  return updated;
};

export const markAllAsRead = async (
  userId: string
): Promise<{ modifiedCount: number }> => {
  const result = await NotificationModel.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  await deleteKeysByPattern(`notifications:${userId}:*`);

  return { modifiedCount: result.modifiedCount };
};

export const createNotification = async (
  data: Partial<INotification>
): Promise<INotification> => {
  const notif = new NotificationModel(data);
  const saved = await notif.save();

  await deleteKeysByPattern(`notifications:${data.userId}:*`);
  return saved;
};

export const createAndEmitNotification = async (
  userId: string,
  data: {
    title: string;
    content: string;
    type: NotificationType;
    metadata?: Record<string, any>;
  }
): Promise<INotification> => {
  const notif = await createNotification(
    {
      ...data, userId:
        new mongoose.Types.ObjectId(userId),
    }
  );

  emitNotification(userId.toString(), data);
  return notif;
};