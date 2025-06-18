// src/validators/colorValidator.ts
import { z } from 'zod';

const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;

export const baseColorSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),

  hexCode: z
    .string()
    .regex(hexColorRegex, 'Invalid hex color code'),

  description: z
    .string()
    .max(255, 'Description must not exceed 255 characters')
    .optional(),
});

export const createColorSchema = baseColorSchema.partial();
export const updateColorSchema = baseColorSchema.partial();
