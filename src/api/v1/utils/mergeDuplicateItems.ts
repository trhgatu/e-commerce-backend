import mongoose from "mongoose";

export interface OrderItem {
  inventoryId: mongoose.Types.ObjectId | string;
  productId: mongoose.Types.ObjectId | string;
  colorId?: mongoose.Types.ObjectId | string;
  quantity: number;
  price: number;
}

export function mergeDuplicateItems(items: OrderItem[]): OrderItem[] {
  const mergedMap = new Map<string, OrderItem>();

  for (const item of items) {
    const key = `${item.inventoryId}-${item.colorId}`;
    if (mergedMap.has(key)) {
      mergedMap.get(key)!.quantity += item.quantity;
    } else {
      mergedMap.set(key, { ...item });
    }
  }

  return Array.from(mergedMap.values());
}
