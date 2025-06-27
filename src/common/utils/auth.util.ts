import { Request } from 'express';
import { AppError } from '@common/utils';

export const getUserId = (req: Request): string => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized: Missing user ID', 401);
  return userId;
};

export const getUserRoleId = (req: Request): string => {
  const roleId = req.user?.roleId;
  if (!roleId) throw new AppError('Unauthorized: Missing role ID', 401);
  return roleId;
};

export const getUserEmail = (req: Request): string => {
  const email = req.user?.email;
  if (!email) throw new AppError('Unauthorized: Missing email', 401);
  return email;
};
