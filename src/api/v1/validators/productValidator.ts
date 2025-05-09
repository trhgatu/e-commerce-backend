import { z } from 'zod';
import mongoose from 'mongoose';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  price: z.number().positive(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stock: z.number().nonnegative().optional(),

  colorVariants: z.array(z.object({
    colorId: z.string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid colorId',
      })
      .transform((val) => new mongoose.Types.ObjectId(val)),
    stock: z.number(),
  })).optional(),

  categoryId: z.string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid categoryId',
    })
    .transform((val) => new mongoose.Types.ObjectId(val)),

  brand: z.string(),
  isFeatured: z.boolean().optional(),
  discountPercent: z.number().min(0).max(100).optional(),
});

export const updateProductSchema = createProductSchema.partial();
