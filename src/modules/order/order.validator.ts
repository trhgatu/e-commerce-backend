import { z } from 'zod';
import mongoose from 'mongoose';

const objectId = () =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const createOrderSchema = z.object({
  items: z.array(z.object({
    inventoryId: objectId(),
    colorId: objectId(),
    productId: objectId(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().positive().optional(),
  })).min(1, 'Order must have at least one item'),

  voucherCode: z.string().optional(),
  paymentMethod: z.enum(['cod', 'momo', 'vnpay']).default('cod'),

  shippingInfo: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(8, 'Phone number is too short'),
    address: z.string().min(5, 'Address is too short'),
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});
