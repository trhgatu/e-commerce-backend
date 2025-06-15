const isDev = process.env.NODE_ENV === 'development';

import ProductModel, { IProduct } from '../models/productModel';
import { paginate } from '../utils/pagination';
import {
  getCache,
  setCache,
  deleteCache,
  deleteKeysByPattern,
} from './redisService';

export const getAllProducts = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {},
) => {

  const finalFilters: Record<string, any> = {
    isDeleted: false,
    ...filters,
  };
  const cacheKey = `products:page=${page}:limit=${limit}:filters=${JSON.stringify(
    finalFilters
  )}:sort=${JSON.stringify(sort)}`;

  if (!isDev) {
    const cached = await getCache(cacheKey);
    if (cached) return cached;
  }

  const result = await paginate<IProduct>(
    ProductModel,
    { page, limit },
    finalFilters,
    sort,
    [
      { path: 'categoryId', select: 'name' },
      { path: 'brandId', select: 'name' },
      { path: 'availableColors', select: 'name hexCode' },
    ]
  );

  if (!isDev) {
    await setCache(cacheKey, result, 600);
  }

  return result;
};

// Get product by ID + cache
export const getProductById = async (id: string): Promise<IProduct | null> => {
  const cacheKey = `product:${id}`;

  const cached = await getCache<IProduct>(cacheKey);
  if (cached) return cached;

  const product = await ProductModel.findById(id)
    .populate('categoryId', 'name')
    .populate('brandId', 'name')
    .populate('availableColors', 'name hexCode')
    .lean();

  if (product) {
    await setCache(cacheKey, product, 600);
  }

  return product;
};

export const createProduct = async (
  data: Partial<IProduct>,
  userId: string
): Promise<IProduct> => {
   const product = new ProductModel({
    ...data,
    createdBy: userId,
  });
  const saved = await product.save();

  await deleteKeysByPattern('products:*');

  return saved;
};

export const updateProduct = async (
  id: string,
  data: Partial<IProduct>
): Promise<IProduct | null> => {
  const updated = await ProductModel.findByIdAndUpdate(id, data, {
    new: true,
  }).lean();

  await deleteCache(`product:${id}`);
  await deleteKeysByPattern('products:*');

  return updated;
};

export const hardDeleteProduct = async (id: string): Promise<IProduct | null> => {
  const deleted = await ProductModel.findByIdAndDelete(id).lean();

  await deleteCache(`product:${id}`);
  await deleteKeysByPattern('products:*');

  return deleted;
};

export const softDeleteProduct = async (id: string): Promise<IProduct | null> => {
  const deleted = await ProductModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).lean();

  if (deleted) {
    await deleteCache(`product:${id}`);
    await deleteKeysByPattern('products:*');
  }

  return deleted;
};
export const restoreProduct = async (id: string): Promise<IProduct | null> => {
  const restored = await ProductModel.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  ).lean();

  if (restored) {
    await deleteCache(`product:${id}`);
    await deleteKeysByPattern('products:*');
  }

  return restored;
};