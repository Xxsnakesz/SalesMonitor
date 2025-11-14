import { NextApiResponse } from 'next';
import { Role } from '@prisma/client';
import { User } from '@/types';
import { hasRole } from '@/lib/rbac/permissions';

export function requireRole(user: User, allowedRoles: Role[], res: NextApiResponse): boolean {
  if (!hasRole(user, allowedRoles)) {
    res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    return false;
  }
  return true;
}
