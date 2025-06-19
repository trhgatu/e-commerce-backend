import BrandModel, { IBrand } from './brand.model';
import { paginate } from '@common/utils';
import {
  setCache,
  deleteCache,
  deleteKeysByPattern,
  getCache
} from '@shared/services/redis.service';

export const getAllBrands = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  const finalFilters = {
    isDeleted: false,
    ...filters
  }
  const cacheKey = `brands:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache(cacheKey);

  if (cached) return cached;

  const result = await paginate<IBrand>(
    BrandModel,
    { page, limit },
    filters,
    sort,
    'name slug description logo'
  );

  await setCache(cacheKey, result, 600);
  return result;
};

export const getBrandById = async (id: string): Promise<IBrand | null> => {
  const cacheKey = `brand:${id}`;
  const cached = await getCache<IBrand>(cacheKey);
  if (cached) return cached;

  const brand = await BrandModel.findById(id).lean();
  if (brand) await setCache(cacheKey, brand, 600);

  return brand;
};

export const createBrand = async (
  data: Partial<IBrand>,
  userId: string
): Promise<IBrand> => {
  const brand = new BrandModel({
    ...data,
    createdBy: userId
  });
  const saved = await brand.save();

  await deleteKeysByPattern('brands:*');
  await deleteCache(`brand:${saved._id}`);
  return saved;
};

export const updateBrand = async (
  id: string,
  data: Partial<IBrand>,
  userId: string
): Promise<IBrand | null> => {
  const updated = await BrandModel.findByIdAndUpdate(
    id,
    {
      ...data,
      updatedBy: userId
    },
    { new: true }
  ).lean();

  await deleteCache(`brand:${id}`);
  await deleteKeysByPattern('brands:*');

  return updated;
};

export const hardDeleteBrand = async (id: string): Promise<IBrand | null> => {
  const deleted = await BrandModel.findByIdAndDelete(id).lean();

  await deleteCache(`brand:${id}`);
  await deleteKeysByPattern('brands:*');

  return deleted;
};

export const softDeleteBrand = async (id: string): Promise<IBrand | null> => {
  const deleted = await BrandModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).lean();

  if (deleted) {
    await deleteCache(`brand:${id}`);
    await deleteKeysByPattern('brands:*');
  }

  return deleted;
};