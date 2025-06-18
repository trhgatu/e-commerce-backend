const isDev = process.env.NODE_ENV === 'development';

import RoleModel, { IRole } from './role.model'

import { paginate } from '@common/utils';
import {
  getCache,
  setCache,
  deleteCache,
  deleteKeysByPattern,
} from '@shared/services/redis.service';

export const getAllRoles = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {},
) => {

  const finalFilters: Record<string, any> = {
    isDeleted: false,
    ...filters,
  };
  const cacheKey = `roles:page=${page}:limit=${limit}:filters=${JSON.stringify(
    finalFilters
  )}:sort=${JSON.stringify(sort)}`;

  if (!isDev) {
    const cached = await getCache(cacheKey);
    if (cached) return cached;
  }

  const result = await paginate<IRole>(
    RoleModel,
    { page, limit },
    finalFilters,
    sort,
    [
      { path: 'permissions', select: 'name description group label' },
    ]
  );

  if (!isDev) {
    await setCache(cacheKey, result, 600);
  }

  return result;
};

// Get role by ID + cache
export const getRoleById = async (id: string): Promise<IRole | null> => {
  const cacheKey = `role:${id}`;

  const cached = await getCache<IRole>(cacheKey);
  if (cached) return cached;

  const role = await RoleModel.findById(id).lean();

  if (role) {
    await setCache(cacheKey, role, 600);
  }

  return role;
};


export const createRole = async (
  data: Partial<IRole>
): Promise<IRole> => {
  const role = new RoleModel(data);
  const saved = await role.save();

  await deleteKeysByPattern('roles:*');

  return saved;
};

// Update Role + invalidate cả danh sách & chi tiết
export const updateRole = async (
  id: string,
  data: Partial<IRole>
): Promise<IRole | null> => {
  const updated = await RoleModel.findByIdAndUpdate(id, data, {
    new: true,
  }).lean();

  await deleteCache(`role:${id}`);
  await deleteKeysByPattern('roles:*');

  return updated;
};

// Delete Role + invalidate cả danh sách & chi tiết
export const hardDeleteRole = async (id: string): Promise<IRole | null> => {
  const deleted = await RoleModel.findByIdAndDelete(id).lean();

  await deleteCache(`role:${id}`);
  await deleteKeysByPattern('roles:*');

  return deleted;
};

export const softDeleteRole = async (id: string): Promise<IRole | null> => {
  const deleted = await RoleModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).lean();

  if (deleted) {
    await deleteCache(`role:${id}`);
    await deleteKeysByPattern('roles:*');
  }

  return deleted;
};
export const restoreRole = async (id: string): Promise<IRole | null> => {
  const restored = await RoleModel.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  ).lean();

  if (restored) {
    await deleteCache(`role:${id}`);
    await deleteKeysByPattern('roles:*');
  }

  return restored;
};

export const assignPermissionsToRole = async (
  roleId: string,
  permissionIds: string[],
): Promise<IRole | null> => {
  const updated = await RoleModel.findByIdAndUpdate(
    roleId,
    { permissions: permissionIds },
    { new: true }
  ).lean();

  if (updated) {
    await deleteCache(`role:${roleId}`);
    await deleteKeysByPattern('roles:*');
  }
  return updated;
}