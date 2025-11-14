import { Role } from '@prisma/client';
import { User } from '@/types';

export function canAccessCustomer(user: User, customerId: string, amId: string): boolean {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'AM' && user.id === amId) return true;
  return false;
}

export function canAccessDepartmentData(user: User, departmentId: string): boolean {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'GM' && user.departmentId === departmentId) return true;
  return false;
}

export function canManageUser(user: User, targetUserId: string): boolean {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'GM' && user.id === targetUserId) return false;
  return false;
}

export function hasRole(user: User, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(user.role);
}
