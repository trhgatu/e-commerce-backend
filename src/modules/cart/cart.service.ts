import mongoose from 'mongoose';
import CartModel, { ICart } from './cart.model';
import {
  CartItemInput,
  UpdateCartItemInput,
  RemoveFromCartInput
} from './dtos/cart-input.dto';

export const addToCart = async (
  userId: string,
  payload: CartItemInput
): Promise<ICart> => {
  const {
    inventoryId,
    productId,
    colorId,
    size,
    quantity = 1
  } = payload;

  const cart = await CartModel.findOne({ userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(item =>
      item.inventoryId.toString() === inventoryId.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        inventoryId: new mongoose.Types.ObjectId(inventoryId),
        productId: new mongoose.Types.ObjectId(productId),
        colorId: colorId ? new mongoose.Types.ObjectId(colorId) : undefined,
        size,
        quantity
      });
    }

    return await cart.save();
  }

  const newCart = new CartModel({
    userId: new mongoose.Types.ObjectId(userId),
    items: [
      {
        inventoryId: new mongoose.Types.ObjectId(inventoryId),
        productId: new mongoose.Types.ObjectId(productId),
        colorId: colorId ? new mongoose.Types.ObjectId(colorId) : undefined,
        size,
        quantity
      }
    ]
  });

  return await newCart.save();
};

export const getCartByUserId = async (userId: string): Promise<ICart | null> => {
  return await CartModel.findOne({ userId, isCheckedOut: false })
    .populate('items.productId')
    .populate('items.inventoryId')
    .populate('items.colorId')
    .lean();
};

export const removeFromCart = async (
  userId: string,
  { inventoryId }: RemoveFromCartInput
): Promise<ICart | null> => {
  const updated = await CartModel.findOneAndUpdate(
    { userId },
    {
      $pull: {
        items: {
          inventoryId: new mongoose.Types.ObjectId(inventoryId)
        }
      }
    },
    { new: true }
  ).lean();

  return updated;
};

export const updateItemQuantity = async (
  userId: string,
  { inventoryId, quantity }: UpdateCartItemInput
): Promise<ICart | null> => {
  const updated = await CartModel.findOneAndUpdate(
    {
      userId,
      'items.inventoryId': new mongoose.Types.ObjectId(inventoryId)
    },
    {
      $set: {
        'items.$.quantity': quantity
      }
    },
    { new: true }
  ).lean();

  return updated;
};

export const clearCart = async (userId: string): Promise<ICart | null> => {
  const cleared = await CartModel.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  ).lean();

  return cleared;
};
