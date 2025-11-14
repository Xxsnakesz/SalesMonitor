import { Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  username?: string | null;
  name: string;
  role: Role;
  departmentId?: string | null;
  managerId?: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
}

export interface Customer {
  id: string;
  amId: string;
  companyName: string;
  pic: string;
  phone: string;
  email?: string | null;
  potential: number;
  timeline?: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  am?: {
    id: string;
    name: string;
  };
}

export interface Progress {
  id: string;
  customerId: string;
  amId: string;
  date: Date;
  description: string;
  status: string;
  createdAt: Date;
  customer?: {
    id: string;
    companyName: string;
  };
}

export interface Target {
  id: string;
  amount: number;
  currency: string;
  month: number;
  year: number;
  departmentId?: string | null;
  userId?: string | null;
}

export interface DashboardStats {
  targetAmount: number;
  actualAmount: number;
  pipelineValue: number;
  activeCustomers: number;
  customersByStatus: { status: string; count: number; value: number }[];
  needsFollowUp: Customer[];
  recentProgress: Progress[];
}
