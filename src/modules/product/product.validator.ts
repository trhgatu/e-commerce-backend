import { z } from 'zod'
import mongoose from 'mongoose';

export const baseProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  totalStock: z.number().optional(),
  price: z.number().positive({ message: 'Price must be positive' }),
  description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  categoryId: z.string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid categoryId',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),
  availableColors: z
    .array(
      z.string().min(1)
    )
    .optional(),
  brandId: z.string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid brandId',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),

  isFeatured: z.boolean().optional().default(false),
  discountPercent: z.number().int().min(0).max(100).optional().default(0),

  status: z.enum(['active', 'draft', 'out_of_stock', 'discontinued']).optional().default('draft'),

});

export const createProductSchema = baseProductSchema;

export const updateProductSchema = baseProductSchema.partial();