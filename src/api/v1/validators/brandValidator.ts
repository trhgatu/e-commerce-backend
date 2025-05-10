import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  logo: z.string().url('Logo must be a valid URL').optional(),
  description: z.string().optional(),
});

export const updateBrandSchema = createBrandSchema.partial();
