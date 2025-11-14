import { z } from 'zod';

export const createProgressSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  description: z.string().min(1, 'Description is required'),
  status: z.string().min(1, 'Status is required'),
});

export type CreateProgressInput = z.infer<typeof createProgressSchema>;
