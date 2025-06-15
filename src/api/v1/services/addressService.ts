import Address, { IAddress } from '../models/addressModel';
import { getCache, setCache, deleteCache } from './redisService';

export const getUserAddresses = async (userId: string): Promise<IAddress[]> => {
    const cacheKey = `addresses:${userId}`;
    const cached = await getCache<IAddress[]>(cacheKey);
    if (cached)
        return cached;

    const addresses = await Address.find({ userId, isDeleted: false })
        .sort({ isDefault: -1, updatedAt: -1 })
        .lean();

    await setCache(cacheKey, addresses, 600);
    return addresses;
};

export const getAddressById = async (id: string): Promise<IAddress | null> => {
    return await Address.findById(id).lean();
};

export const createAddress = async (data: Partial<IAddress>): Promise<IAddress> => {
    const address = new Address(data);
    const saved = await address.save();
    await deleteCache(`addresses:${data.userId}`);
    return saved;
};

export const updateAddress = async (
    id: string,
    data: Partial<IAddress>
): Promise<IAddress | null> => {
    const updated = await Address.findByIdAndUpdate(id, data, { new: true });
    if (updated) await deleteCache(`addresses:${updated.userId}`);
    return updated?.toObject() || null;
};

export const deleteAddress = async (id: string): Promise<IAddress | null> => {
    const deleted = await Address.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (deleted) await deleteCache(`addresses:${deleted.userId}`);
    return deleted?.toObject() || null;
};

export const setDefaultAddress = async (
    userId: string,
    addressId: string
): Promise<IAddress | null> => {
    await Address.updateMany({ userId }, { isDefault: false });
    const updated = await Address.findByIdAndUpdate(
        addressId,
        { isDefault: true },
        { new: true }
    );
    if (updated)
        await deleteCache(`addresses:${userId}`);
    return updated?.toObject() || null;
};
