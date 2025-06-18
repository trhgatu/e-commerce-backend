// src/api/v1/services/logService.ts
import { LogModel, ILog, LogAction } from '@common/models';
import { paginate } from '@common/utils';
import {
    getCache,
    setCache,
    deleteCache,
    deleteKeysByPattern
} from '@shared/services/redis.service';

export const getAllLogs = async (
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
) => {
    const finalFilters = { ...filters };

    const cacheKey = `logs:page=${page}:limit=${limit}:filters=${JSON.stringify(filters)}:sort=${JSON.stringify(sort)}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const result = await paginate<ILog>(
        LogModel,
        { page, limit },
        finalFilters,
        sort,
        [
            { path: 'userId', select: 'fullName email roleId' }
        ]
    );
    await setCache(cacheKey, result, 300);
    return result;
};


export const getLogById = async (id: string): Promise<ILog | null> => {
    const cacheKey = `log:${id}`;
    const cached = await getCache<ILog>(cacheKey);
    if (cached) return cached;

    const log = await LogModel.findById(id)
        .populate({ path: 'userId', select: 'fullName email roleId' })
        .lean();

    if (log) {
        await setCache(cacheKey, log, 300);
    }

    return log;
};

export const logAction = async ({
    userId,
    targetModel,
    targetId,
    action,
    description,
    metadata = {},
}: {
    userId: string;
    targetModel: string;
    targetId: string;
    action: LogAction;
    description: string;
    metadata?: Record<string, any>;
}): Promise<ILog> => {
    const log = new LogModel({
        userId,
        targetModel,
        targetId,
        action,
        description,
        metadata,
    });

    const saved = await log.save();

    await deleteKeysByPattern('logs:*');
    return saved;
};

export const hardDeleteLog = async (id: string): Promise<ILog | null> => {
    const deleted = await LogModel.findByIdAndDelete(id).lean();

    if (deleted) {
        await deleteCache(`log:${id}`);
        await deleteKeysByPattern('logs:*');
    }

    return deleted;
};

export const clearAllLogs = async () => {
    await LogModel.deleteMany({});
    await deleteKeysByPattern('logs:*');
};
