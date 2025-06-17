import mongoose from 'mongoose';
import CartModel from '../models/cartModel';
import InventoryModel, { IInventory } from '../models/inventoryModel';
import { CreateOrderInput, OrderItemInput, ShippingInfoInput } from '../types/order/orderDTO';
import { PaymentMethod } from '../models/orderModel';
import { IProduct } from '../models/productModel';

type PopulatedInventory = IInventory & {
  _id: mongoose.Types.ObjectId;
  productId: IProduct;
};

export const checkoutCartToOrder = async (
  userId: string,
  paymentMethod: PaymentMethod,
  shippingInfo: ShippingInfoInput,
  voucherCode?: string
): Promise<CreateOrderInput> => {
  const cart = await CartModel.findOne({ userId, isCheckedOut: false }).lean();

  if (!cart || cart.items.length === 0) {
    throw new Error('Giỏ hàng trống hoặc không tồn tại');
  }

  const orderItems: OrderItemInput[] = [];

  for (const cartItem of cart.items) {
    const inventoryDoc = await InventoryModel.findById(cartItem.inventoryId)
      .populate<{ productId: IProduct }>('productId');

    if (!inventoryDoc) {
      throw new Error(`Không tìm thấy tồn kho cho inventoryId ${cartItem.inventoryId}`);
    }

    const inventory = inventoryDoc as unknown as PopulatedInventory;

    if (inventory.quantity < cartItem.quantity) {
      throw new Error(`Không đủ tồn kho cho sản phẩm ${inventory.productId.name}`);
    }

    const product = inventory.productId;

    orderItems.push({
      inventoryId: inventory._id.toString(),
      productId: product._id.toString(),
      colorId: inventory.colorId?.toString(),
      size: inventory.size,
      quantity: cartItem.quantity,
      price: product.price,
    });
  }

  const orderInput: CreateOrderInput = {
    items: orderItems,
    shippingInfo,
    paymentMethod,
    voucherCode,
  };

  return orderInput;
};
