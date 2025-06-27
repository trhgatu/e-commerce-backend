// src/validators/inventoryValidator.ts
import { z } from 'zod';
import mongoose from 'mongoose';

export const createInventorySchema = z.object({
  productId: z
    .string()
    .refine(mongoose.isValidObjectId, { message: 'Invalid productId' }),
  colorId: z
    .string()
    .optional()
    .refine((val) => !val || mongoose.isValidObjectId(val), {
      message: 'Invalid colorId',
    }),
  minQuantity: z
    .number()
    .int()
    .min(0, { message: 'Min quantity must be >= 0' })
    .optional(),
  maxQuantity: z
    .number()
    .int()
    .min(0, { message: 'Max quantity must be >= 0' })
    .optional(),
  size: z.string().optional(),
  quantity: z.number().int().min(0, { message: 'Quantity must be >= 0' }),
});

export const updateInventorySchema = createInventorySchema.partial();
