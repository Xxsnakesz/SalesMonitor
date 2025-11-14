import { z } from 'zod';

export const createCustomerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  pic: z.string().min(1, 'PIC name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  potential: z.number().min(0, 'Potential must be positive'),
  timeline: z.string().optional(),
  status: z.enum(['prospect', 'ongoing', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
