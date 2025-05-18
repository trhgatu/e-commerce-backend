import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().length(24, 'Invalid productId'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').optional(),
});

export const updateCartItemSchema = z.object({
  productId: z.string().length(24, 'Invalid productId'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});
