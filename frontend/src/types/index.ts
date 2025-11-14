cd /var/www/html/SalesMonitor

# Remove the corrupted file
rm frontend/src/types/index.ts

# Create a clean version
cat > frontend/src/types/index.ts << 'EOF'
// Define Role enum locally instead of importing from Prisma
export enum Role {
  ADMIN = 'ADMIN',
  GM = 'GM',
  AM = 'AM'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  gmId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Target {
  id: string;
  userId: string;
  amount: number;
  period: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Sale {
  id: string;
  userId: string;
  amount: number;
  date: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
  gmId?: string;
}

export interface CustomersByStatus {
  status: string;
  count: number;
}

export interface DashboardStats {
  totalSales: number;
  totalTarget: number;
  progress: number;
  salesCount: number;
  targetAmount?: number;
  actualAmount?: number;
  pipelineValue?: number;
  activeCustomers?: number;
  customersByStatus?: CustomersByStatus[];
  topPerformers?: Array<{
    name: string;
    sales: number;
    target: number;
    progress: number;
  }>;
  needsFollowUp?: Array<{
    id: string;
    companyName: string;
    pic: string;
    status: string;
    potential: number;
  }>;
  recentProgress?: Array<{
    id: string;
    description: string;
    date: string;
    customer?: {
      companyName: string;
    };
  }>;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
EOF

# Verify it's clean
head -3 frontend/src/types/index.ts