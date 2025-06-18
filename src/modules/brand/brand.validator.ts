import { z } from 'zod';

export const baseBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  description: z.string().optional(),
  logo: z.string().url('Brand must be invalid URL').optional()
});

export const createBrandSchema = baseBrandSchema.partial();
export const updateBrandSchema = baseBrandSchema.partial();
