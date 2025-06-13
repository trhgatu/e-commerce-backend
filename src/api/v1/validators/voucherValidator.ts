import { z } from 'zod';

export const createVoucherSchema = z.object({
  code: z.string().min(3),
  type: z.enum(['fixed', 'percentage']),
  value: z.number().min(1),
  minOrderValue: z.number().optional(),
  maxDiscountValue: z.number().optional(),
  usageLimit: z.number().optional(),
  usagePerUser: z.number().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().default(true),
});
