import { z } from 'zod';

export const createTargetSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('IDR'),
  month: z.number().min(1).max(12, 'Month must be between 1 and 12'),
  year: z.number().min(2000).max(2100, 'Invalid year'),
  departmentId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export type CreateTargetInput = z.infer<typeof createTargetSchema>;
