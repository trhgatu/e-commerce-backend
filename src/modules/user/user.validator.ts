import { z } from 'zod';
import mongoose from 'mongoose';

export const baseUserSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(100, 'Full name must not exceed 100 characters'),

  email: z
    .string()
    .email('Invalid email address'),

  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must not exceed 30 characters'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),

  role: z
    .enum(['user', 'admin'], {
      errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
    }),

  phone: z
    .string()
    .optional(),

  avatarUrl: z
    .string()
    .url('Avatar URL must be a valid URL')
    .optional(),

  address: z
    .string()
    .optional(),

  gender: z
    .enum(['male', 'female', 'other'])
    .optional(),

  /* birthDate: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid birth date format',
    })
    .optional(), */

  membershipRankId: z
    .string()
    .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid membershipRankId',
    })
    .transform((val) => (val ? new mongoose.Types.ObjectId(val) : undefined))
    .optional(),
});

// ✅ Schema for creating a new user (password is required)
export const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

// ✅ Schema for updating a user (all fields optional)
export const updateUserSchema = baseUserSchema.partial();
