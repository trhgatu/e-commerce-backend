const isDev = process.env.NODE_ENV === 'development';

import PermissionModel, { IPermission } from '../models/permissionModel';

import { paginate } from '../utils/pagination';
import {
    getCache,
    setCache,
    deleteCache,
    deleteKeysByPattern,
} from './redisService';

export const getAllPermissions = async (
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1> = {},
) => {

    const finalFilters: Record<string, any> = {
        isDeleted: false,
        ...filters,
    };
    const cacheKey = `permissions:page=${page}:limit=${limit}:filters=${JSON.stringify(
        finalFilters
    )}:sort=${JSON.stringify(sort)}`;

    if (!isDev) {
        const cached = await getCache(cacheKey);
        if (cached) return cached;
    }

    const result = await paginate<IPermission>(
        PermissionModel,
        { page, limit },
        finalFilters,
        sort,

    );

    if (!isDev) {
        await setCache(cacheKey, result, 600);
    }

    return result;
};

// Get permission by ID + cache
export const getPermissionById = async (id: string): Promise<IPermission | null> => {
    const cacheKey = `permission:${id}`;

    const cached = await getCache<IPermission>(cacheKey);
    if (cached) return cached;

    const permission = await PermissionModel.findById(id).lean();

    if (permission) {
        await setCache(cacheKey, permission, 600);
    }

    return permission;
};


export const createPermission = async (
    data: Partial<IPermission>
): Promise<IPermission> => {
    const permission = new PermissionModel(data);
    const saved = await permission.save();

    await deleteKeysByPattern('permissions:*');

    return saved;
};

export const bulkCreatePermissions = async (
  data: Partial<IPermission>[]
): Promise<IPermission[]> => {
  const validData = data.filter(
    (item): item is Pick<IPermission, 'name' | 'label' | 'group'> =>
      !!item.name && !!item.label && !!item.group
  );
  const saved = await PermissionModel.insertMany(validData);
  await deleteKeysByPattern('permissions:*');
  return saved as IPermission[];
};


// Update Permission + invalidate cả danh sách & chi tiết
export const updatePermission = async (
    id: string,
    data: Partial<IPermission>
): Promise<IPermission | null> => {
    const updated = await PermissionModel.findByIdAndUpdate(id, data, {
        new: true,
    }).lean();

    await deleteCache(`permission:${id}`);
    await deleteKeysByPattern('permissions:*');

    return updated;
};

// Delete permission + invalidate cả danh sách & chi tiết
export const hardDeletePermission = async (id: string): Promise<IPermission | null> => {
    const deleted = await PermissionModel.findByIdAndDelete(id).lean();

    await deleteCache(`permission:${id}`);
    await deleteKeysByPattern('permissions:*');

    return deleted;
};

export const softDeletePermission = async (id: string): Promise<IPermission | null> => {
    const deleted = await PermissionModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    ).lean();

    if (deleted) {
        await deleteCache(`permission:${id}`);
        await deleteKeysByPattern('permissions:*');
    }

    return deleted;
};
export const restorePermission = async (id: string): Promise<IPermission | null> => {
    const restored = await PermissionModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true }
    ).lean();

    if (restored) {
        await deleteCache(`permission:${id}`);
        await deleteKeysByPattern('permissions:*');
    }

    return restored;
};