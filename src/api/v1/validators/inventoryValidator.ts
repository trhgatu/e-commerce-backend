// src/validators/inventoryValidator.ts
import { z } from 'zod';
import mongoose from 'mongoose';

export const createInventorySchema = z.object({
  productId: z.string().refine(mongoose.isValidObjectId, { message: 'Invalid productId' }),
  colorId: z.string().optional().refine(
    (val) => !val || mongoose.isValidObjectId(val),
    { message: 'Invalid colorId' }
  ),
  size: z.string().optional(),
  quantity: z.number().int().min(0, { message: 'Quantity must be >= 0' })
});

export const updateInventorySchema = createInventorySchema.partial();
