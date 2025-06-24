import UserModel, { IUser } from './user.model';
import { paginate } from '@common/utils';
import {
    getCache,
    setCache,
    deleteCache,
    deleteKeysByPattern
} from '@shared/services/redis.service';

export const getAllUsers = async (
    page: number,
    limit: number,
    filters: Record<string, unknown> = {},
    sort: Record<string, 1 | -1> = {}
) => {
    const finalFilters: Record<string, unknown> = {
        isDeleted: false,
        ...filters,
    };
    const cacheKey = `users:page=${page}:limit=${limit}:filters=${JSON.stringify(
        finalFilters
    )}:sort=${JSON.stringify(sort)}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const result = await paginate<IUser>(
        UserModel,
        { page, limit },
        finalFilters,
        sort,
        [
            { path: "roleId", select: "name permissions" },
        ]
    )
    return result;

};

export const getUserById = async (id: string): Promise<IUser | null> => {
    const cacheKey = `user:${id}`;
    const cached = await getCache<IUser>(cacheKey);
    if (cached) return cached;

    const user = await UserModel.findById(id).select('-password').lean();
    if (user) await setCache(cacheKey, user, 600);

    return user;
};

export const createUser = async (
    data: Partial<IUser>
): Promise<IUser> => {
    const user = new UserModel(data);
    const saved = await user.save();

    await deleteKeysByPattern('users:*');
    return saved;
};

export const updateUser = async (
    id: string,
    data: Partial<IUser>
): Promise<IUser | null> => {
    const updated = await UserModel.findByIdAndUpdate(id, data, { new: true })
        .select('-password')
        .lean();

    if (updated) {
        await deleteCache(`user:${id}`);
        await deleteKeysByPattern('users:*');
    }

    return updated;
};

export const hardDeleteUser = async (id: string): Promise<IUser | null> => {
    const deleted = await UserModel.findByIdAndDelete(id).select('-password').lean();

    if (deleted) {
        await deleteCache(`user:${id}`);
        await deleteKeysByPattern('users:*');
    }

    return deleted;
};


export const softDeleteUser = async (id: string): Promise<IUser | null> => {
    const deleted = await UserModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    ).select('-password').lean();

    if (deleted) {
        await deleteCache(`user:${id}`);
        await deleteKeysByPattern('users:*');
    }

    return deleted;
};


