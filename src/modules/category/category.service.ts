import CategoryModel, { ICategory } from './category.model';
import { paginate } from '@common/utils';
import {
  setCache,
  getCache,
  deleteCache,
  deleteKeysByPattern,
} from '@shared/services/redis.service';

export const getAllCategories = async (
  page: number,
  limit: number,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  const finalFilters: Record<string, unknown> = {
    isDeleted: false,
    ...filters,
  };
  const cacheKey = `categories:page=${page}:limit=${limit}:filters=${JSON.stringify(
    finalFilters
  )}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const result = await paginate<ICategory>(
    CategoryModel,
    { page, limit },
    finalFilters,
    sort
  );

  await setCache(cacheKey, result, 600);
  return result;
};

export const getCategoryById = async (
  id: string
): Promise<ICategory | null> => {
  const cacheKey = `category:${id}`;
  const cached = await getCache<ICategory>(cacheKey);
  if (cached) return cached;

  const category = await CategoryModel.findById(id).lean();
  if (category) await setCache(cacheKey, category, 600);

  return category;
};

export const createCategory = async (
  data: Partial<ICategory>,
  userId: string
): Promise<ICategory> => {
  const category = new CategoryModel({
    ...data,
    createdBy: userId,
  });
  const saved = await category.save();

  await deleteKeysByPattern('categories:*');
  await deleteCache(`category:${saved._id}`);

  return saved;
};

export const updateCategory = async (
  id: string,
  data: Partial<ICategory>,
  userId: string
): Promise<ICategory | null> => {
  const updated = await CategoryModel.findByIdAndUpdate(
    id,
    {
      ...data,
      updatedBy: userId,
    },
    { new: true }
  ).lean();

  await deleteCache(`category:${id}`);
  await deleteKeysByPattern('categories:*');

  return updated;
};

export const hardDeleteCategory = async (
  id: string
): Promise<ICategory | null> => {
  const deleted = await CategoryModel.findByIdAndDelete(id).lean();

  await deleteCache(`category:${id}`);
  await deleteKeysByPattern('categories:*');

  return deleted;
};

export const softDeleteCategory = async (
  id: string,
  userId: string
): Promise<ICategory | null> => {
  const deleted = await CategoryModel.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedBy: userId,
    },
    { new: true }
  ).lean();

  if (deleted) {
    await deleteCache(`category:${id}`);
    await deleteKeysByPattern('categories:*');
  }

  return deleted;
};

export const restoreCategory = async (
  id: string
): Promise<ICategory | null> => {
  const restored = await CategoryModel.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  ).lean();

  if (restored) {
    await deleteCache(`category:${id}`);
    await deleteKeysByPattern('categories:*');
  }

  return restored;
};
