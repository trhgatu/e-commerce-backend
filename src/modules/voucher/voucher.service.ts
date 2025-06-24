import {
    VoucherModel,
    UserVoucherModel,
    IVoucher
} from '@modules/voucher/models';
import { paginate } from '@common/utils';
import {
    getCache,
    setCache,
    deleteCache,
    deleteKeysByPattern,
} from '@shared/services/redis.service';
import { Types } from 'mongoose';

const isDev = process.env.NODE_ENV === 'development';

export const getAllVouchers = async (
    page: number,
    limit: number,
    filters: Record<string, unknown> = {},
    sort: Record<string, 1 | -1> = {}
) => {
    const finalFilters: Record<string, unknown> = {
        isDeleted: false,
        ...filters,
    };

    const cacheKey = `vouchers:page=${page}:limit=${limit}:filters=${JSON.stringify(
        finalFilters
    )}:sort=${JSON.stringify(sort)}`;

    if (!isDev) {
        const cached = await getCache(cacheKey);
        if (cached) return cached;
    }

    const result = await paginate<IVoucher>(
        VoucherModel,
        { page, limit },
        finalFilters,
        sort
    );

    if (!isDev) {
        await setCache(cacheKey, result, 600);
    }

    return result;
};

export const getVoucherById = async (id: string): Promise<IVoucher | null> => {
    const cacheKey = `voucher:${id}`;
    const cached = await getCache<IVoucher>(cacheKey);
    if (cached) return cached;

    const voucher = await VoucherModel.findById(id).lean();
    if (voucher) await setCache(cacheKey, voucher, 600);

    return voucher;
};

export const createVoucher = async (
    data: Partial<IVoucher>
): Promise<IVoucher> => {
    const voucher = new VoucherModel(data);
    const saved = await voucher.save();
    await deleteKeysByPattern('vouchers:*');
    return saved;
};

export const updateVoucher = async (
    id: string,
    data: Partial<IVoucher>
): Promise<IVoucher | null> => {
    const updated = await VoucherModel.findByIdAndUpdate(id, data, {
        new: true,
    }).lean();

    await deleteCache(`voucher:${id}`);
    await deleteKeysByPattern('vouchers:*');

    return updated;
};

export const softDeleteVoucher = async (
    id: string
): Promise<IVoucher | null> => {
    const deleted = await VoucherModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    ).lean();

    if (deleted) {
        await deleteCache(`voucher:${id}`);
        await deleteKeysByPattern('vouchers:*');
    }

    return deleted;
};

export const restoreVoucher = async (
    id: string
): Promise<IVoucher | null> => {
    const restored = await VoucherModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true }
    ).lean();

    if (restored) {
        await deleteCache(`voucher:${id}`);
        await deleteKeysByPattern('vouchers:*');
    }

    return restored;
};

export const hardDeleteVoucher = async (
    id: string
): Promise<IVoucher | null> => {
    const deleted = await VoucherModel.findByIdAndDelete(id).lean();
    await deleteCache(`voucher:${id}`);
    await deleteKeysByPattern('vouchers:*');
    return deleted;
};

// ------------------------------
// USER
// ------------------------------

export const validateVoucherUsage = async (
    code: string,
    userId: string,
    orderTotal: number
): Promise<{
    discount: number;
    finalTotal: number;
    voucher: IVoucher;
}> => {
    const voucher = await VoucherModel.findOne({
        code: code.toUpperCase(),
        isDeleted: false,
        isActive: true,
    });

    if (!voucher) throw new Error('Voucher not found or inactive.');

    const now = new Date();
    if (
        voucher.startDate.getTime() > now.getTime() ||
        voucher.endDate.getTime() < now.getTime()
    ) {
        throw new Error('Voucher is expired or not yet active.');
    }

    if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit)
        throw new Error('Voucher usage limit exceeded.');

    if (voucher.minOrderValue && orderTotal < voucher.minOrderValue)
        throw new Error(`Minimum order value must be ${voucher.minOrderValue}`);

    const userVoucher = await UserVoucherModel.findOne({
        voucherId: voucher._id,
        userId: new Types.ObjectId(userId),
    });

    if (
        voucher.usagePerUser &&
        userVoucher &&
        userVoucher.usedCount >= voucher.usagePerUser
    ) {
        throw new Error('You have already used this voucher.');
    }

    let discount = 0;
    if (voucher.type === 'fixed') {
        discount = voucher.value;
    } else {
        discount = (orderTotal * voucher.value) / 100;
        if (voucher.maxDiscountValue) {
            discount = Math.min(discount, voucher.maxDiscountValue);
        }
    }

    return {
        discount,
        finalTotal: Math.max(0, orderTotal - discount),
        voucher,
    };
};

export const increaseVoucherUsage = async (
    voucherId: string,
    userId: string
) => {
    await VoucherModel.findByIdAndUpdate(voucherId, {
        $inc: { usageCount: 1 },
    });

    await UserVoucherModel.findOneAndUpdate(
        {
            voucherId: new Types.ObjectId(voucherId),
            userId: new Types.ObjectId(userId),
        },
        { $inc: { usedCount: 1 } },
        { upsert: true }
    );
};
