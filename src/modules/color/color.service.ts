import ColorModel, { IColor } from './color.model';
import { paginate } from '@common/utils';
import {
    deleteCache,
    deleteKeysByPattern,
    getCache,
    setCache
} from '@shared/services/redis.service';

export const getAllColors = async (
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1> = {}
) => {
    const cacheKey = `colors:page=${page}:limit=${limit}:filters=${JSON.stringify(filters)}:sort=${JSON.stringify(sort)}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const result = await paginate<IColor>(
        ColorModel,
        { page, limit },
        filters,
        sort,
    );

    await setCache(cacheKey, result, 600);
    return result;
};

export const getColorById = async (id: string): Promise<IColor | null> => {
    const cacheKey = `color:${id}`;
    const cached = await getCache<IColor>(cacheKey);
    if (cached) return cached;

    const color = await ColorModel.findById(id).select('-__v').lean();
    if (color) await setCache(cacheKey, color, 600);

    return color;
};

export const createColor = async (
    data: Partial<IColor>,
    userId: string
): Promise<IColor> => {
    const color = new ColorModel({
        ...data,
        createdBy: userId
    }
    );
    const saved = await color.save();

    await deleteKeysByPattern('colors:*');
    await deleteCache(`color:${saved._id}`);
    return saved;
};

export const updateColor = async (
    id: string,
    data: Partial<IColor>,
    userId: string
): Promise<IColor | null> => {
    const updated = await ColorModel.findByIdAndUpdate(id, {
        ...data,
        updatedBy: userId,
    }, { new: true }).lean();

    await deleteCache(`color:${id}`);
    await deleteKeysByPattern('colors:*');

    return updated;
};

export const hardDeleteColor = async (id: string): Promise<IColor | null> => {
    const deleted = await ColorModel.findByIdAndDelete(id).lean();

    await deleteCache(`color:${id}`);
    await deleteKeysByPattern('colors:*');

    return deleted;
};

export const softDeleteColor = async (
    id: string,
    userId: string
): Promise<IColor | null> => {
    const deleted = await ColorModel.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
            deletedBy: userId
        },
        { new: true }
    ).lean();

    if (deleted) {
        await deleteCache(`color:${id}`);
        await deleteKeysByPattern('colors:*');
    }

    return deleted;
};

export const restoreColor = async (id: string): Promise<IColor | null> => {
    const deleted = await ColorModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true }
    ).lean();

    if (deleted) {
        await deleteCache(`color:${id}`);
        await deleteKeysByPattern('colors:*');
    }

    return deleted;
};