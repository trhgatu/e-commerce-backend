import CategoryModel, { ICategory } from '../models/categoryModel';
import { paginate } from '../utils/pagination';
import {
  setCache,
  getCache,
  deleteCache,
  deleteKeysByPattern
} from './redisService';

export const getAllCategories = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  const finalFilters: Record<string, any> = {
    isDeleted: false,
    ...filters,
  }
  const cacheKey = `categories:page=${page}:limit=${limit}:filters=${JSON.stringify(
    finalFilters
  )}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const result = await paginate<ICategory>(
    CategoryModel,
    { page, limit },
    finalFilters,
    sort,
  );

  await setCache(cacheKey, result, 600);
  return result;
};


export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  const cacheKey = `category:${id}`;
  const cached = await getCache<ICategory>(cacheKey);
  if (cached) return cached;

  const category = await CategoryModel.findById(id).lean();
  if (category) await setCache(cacheKey, category, 600);

  return category;
};


export const createCategory = async (data: Partial<ICategory>): Promise<ICategory> => {
  const category = new CategoryModel(data);
  const saved = await category.save();

  await deleteKeysByPattern('categories:*');
  await deleteCache(`category:${saved._id}`);

  return saved;
};


export const updateCategory = async (
  id: string,
  data: Partial<ICategory>
): Promise<ICategory | null> => {
  const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true }).lean();

  await deleteCache(`category:${id}`);
  await deleteKeysByPattern('categories:*');

  return updated;
};


export const hardDeleteCategory = async (id: string): Promise<ICategory | null> => {
  const deleted = await CategoryModel.findByIdAndDelete(id).lean();

  await deleteCache(`category:${id}`);
  await deleteKeysByPattern('categories:*');

  return deleted;
};

export const softDeleteCategory = async (id: string): Promise<ICategory | null> => {
  const deleted = await CategoryModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).lean();

  if (deleted) {
    await deleteCache(`category:${id}`);
    await deleteKeysByPattern('categories:*');
  }

  return deleted;
};

export const restoreCategory = async (id: string): Promise<ICategory | null> => {
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

export const getCategoryTree = async (): Promise<any[]> => {
  const cacheKey = `categories:tree`;
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

  const categories = await CategoryModel.find({ parentId: null }).populate({
    path: 'children',
    model: 'Category',
    populate: {
      path: 'children',
      model: 'Category'
    }
  }).lean();

  await setCache(cacheKey, categories, 1800);

  return categories;
};

