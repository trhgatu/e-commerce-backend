// src/services/inventoryService.ts
import Inventory, { IInventory } from '../models/inventoryModel';
import Product from '../models/productModel';
import { paginate } from '../utils/pagination';
import {
  getCache,
  setCache,
  deleteCache,
  deleteKeysByPattern
} from './redisService';

import mongoose from 'mongoose';

const updateTotalStock = async (productId: string) => {
  const result = await Inventory.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, total: { $sum: '$quantity' } } }
  ]);

  const totalStock = result[0]?.total || 0;
  await Product.findByIdAndUpdate(productId, { totalStock });
};

export const getAllInventories = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  const cacheKey = `inventories:page=${page}:limit=${limit}:filters=${JSON.stringify(filters)}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const result = await paginate<IInventory>(
    Inventory,
    { page, limit },
    filters,
    sort,
    [
      { path: 'productId', select: 'name' },
      { path: 'colorId', select: 'name hexCode' }
    ]
  );

  await setCache(cacheKey, result, 600);
  return result;
};

export const getInventoryById = async (id: string): Promise<IInventory | null> => {
  const cacheKey = `inventory:${id}`;
  const cached = await getCache<IInventory>(cacheKey);
  if (cached) return cached;

  const inventory = await Inventory.findById(id)
    .populate('productId', 'name')
    .populate('colorId', 'name hexCode')
    .lean();

  if (inventory) await setCache(cacheKey, inventory, 600);
  return inventory;
};

export const createInventory = async (data: Partial<IInventory>): Promise<IInventory> => {
  const inventory = new Inventory(data);
  const saved = await inventory.save();

  await updateTotalStock(saved.productId.toString());
  await deleteKeysByPattern('inventories:*');
  return saved;
};

export const updateInventory = async (
  id: string,
  data: Partial<IInventory>
): Promise<IInventory | null> => {
  const updated = await Inventory.findByIdAndUpdate(id, data, { new: true });

  if (updated) {
    await updateTotalStock(updated.productId.toString());
    await deleteCache(`inventory:${id}`);
    await deleteKeysByPattern('inventories:*');
  }

  return updated?.toObject() || null;
};

export const deleteInventory = async (id: string): Promise<IInventory | null> => {
  const deleted = await Inventory.findByIdAndDelete(id);

  if (deleted) {
    await updateTotalStock(deleted.productId.toString());
    await deleteCache(`inventory:${id}`);
    await deleteKeysByPattern('inventories:*');
  }

  return deleted?.toObject() || null;
};

export const getInventoriesByProductId = async (productId: string): Promise<IInventory[]> => {
  return await Inventory.find({ productId })
    .populate('colorId', 'name hexCode')
    .sort({ size: 1 })
    .lean();
};

export const getInventorySummaryByProductId = async (
  productId: string
): Promise<{ totalStock: number }> => {
  const result = await Inventory.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, total: { $sum: '$quantity' } } }
  ]);

  return { totalStock: result[0]?.total || 0 };
};

export const increaseInventoryQuantity = async (
  id: string,
  amount: number
): Promise<IInventory | null> => {
  const updated = await Inventory.findByIdAndUpdate(
    id,
    { $inc: { quantity: amount } },
    { new: true }
  );

  if (updated) {
    await updateTotalStock(updated.productId.toString());
    await deleteCache(`inventory:${id}`);
    await deleteKeysByPattern('inventories:*');
  }

  return updated?.toObject() || null;
};

export const decreaseInventoryQuantity = async (
  id: string,
  amount: number
): Promise<IInventory | null> => {
  const updated = await Inventory.findByIdAndUpdate(
    id,
    { $inc: { quantity: -amount } },
    { new: true }
  );

  if (updated) {
    await updateTotalStock(updated.productId.toString());
    await deleteCache(`inventory:${id}`);
    await deleteKeysByPattern('inventories:*');
  }

  return updated?.toObject() || null;
};
