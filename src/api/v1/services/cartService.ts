import CartModel, { ICart } from '../models/cartModel';
import mongoose from 'mongoose';

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<ICart> => {
  const cart = await CartModel.findOne({ userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(item =>
      item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }

    return await cart.save();
  }

  const newCart = new CartModel({
    userId: new mongoose.Types.ObjectId(userId),
    items: [{ productId: new mongoose.Types.ObjectId(productId), quantity }],
  });

  return await newCart.save();
};


export const getCartByUserId = async (userId: string): Promise<ICart | null> => {
  return await CartModel.findOne({ userId, isCheckedOut: false })
    .populate('items.productId')
    .lean();
};


export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<ICart | null> => {
  const updated = await CartModel.findOneAndUpdate(
    { userId },
    {
      $pull: {
        items: { productId: new mongoose.Types.ObjectId(productId) },
      },
    },
    { new: true }
  ).lean();

  return updated;
};


export const updateItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart | null> => {
  const updated = await CartModel.findOneAndUpdate(
    { userId, 'items.productId': productId },
    {
      $set: {
        'items.$.quantity': quantity,
      },
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
