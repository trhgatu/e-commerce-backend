import { z } from 'zod';
import mongoose from 'mongoose';

export const baseCategorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters long').max(255, 'Category name must not exceed 255 characters'),

  parentId: z.string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid parentId',
    })
    .transform((val) => (val ? new mongoose.Types.ObjectId(val) : null))
    .optional(),

  description: z.string().optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = baseCategorySchema.partial();

export const createCategorySchema = baseCategorySchema;
