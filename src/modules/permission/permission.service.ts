import PermissionModel, { IPermission } from './permission.model';

import { paginate } from '@common/utils';
import {
    getCache,
    setCache,
    deleteCache,
    deleteKeysByPattern,
} from '@shared/services/redis.service';

export const getAllPermissions = async (
    page: number,
    limit: number,
    filters: Record<string, unknown> = {},
    sort: Record<string, 1 | -1> = {},
) => {

    const finalFilters: Record<string, unknown> = {
        isDeleted: false,
        ...filters,
    };
    const cacheKey = `permissions:page=${page}:limit=${limit}:filters=${JSON.stringify(
        finalFilters
    )}:sort=${JSON.stringify(sort)}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const result = await paginate<IPermission>(
        PermissionModel,
        { page, limit },
        finalFilters,
        sort,

    );
    await setCache(cacheKey, result, 600);
    return result;
};

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