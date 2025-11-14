import { z } from 'zod';
import { Role } from '@prisma/client';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  departmentId: z.string().uuid().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(Role),
  departmentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  username: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  departmentId: z.string().uuid().optional().nullable(),
  managerId: z.string().uuid().optional().nullable(),
  username: z.string().optional().nullable(),
});

// Customer schemas
export const createCustomerSchema = z.object({
  amId: z.string().uuid(),
  companyName: z.string().min(2),
  pic: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional(),
  potential: z.number().positive(),
  timeline: z.string().datetime().optional(),
  status: z.enum(['prospect', 'ongoing', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// Target schemas
export const createTargetSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('IDR'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020),
  departmentId: z.string().uuid().optional().nullable(),
  userId: z.string().uuid().optional().nullable(),
});

// Progress schemas
export const createProgressSchema = z.object({
  customerId: z.string().uuid(),
  description: z.string().min(5),
  status: z.string(),
  date: z.string().datetime().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateTargetInput = z.infer<typeof createTargetSchema>;
export type CreateProgressInput = z.infer<typeof createProgressSchema>;
