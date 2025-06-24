// src/types/cart/cartDTO.ts
import mongoose from 'mongoose';

export interface CartItemInput {
  inventoryId: mongoose.Types.ObjectId | string;
  productId: mongoose.Types.ObjectId | string;
  colorId?: mongoose.Types.ObjectId | string;
  size?: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  inventoryId: mongoose.Types.ObjectId | string;
  quantity: number;
}

export interface RemoveFromCartInput {
  inventoryId: mongoose.Types.ObjectId | string;
}
