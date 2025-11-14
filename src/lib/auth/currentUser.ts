import { NextApiRequest } from 'next';
import { parse } from 'cookie';
import { verifyToken } from './tokens';
import { prisma } from '../prisma';
import { User } from '@/types';

export async function getCurrentUser(req: NextApiRequest): Promise<User | null> {
  try {
    const cookies = parse(req.headers.cookie || '');
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      return null;
    }

    const payload = verifyToken(accessToken);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user || user.deletedAt) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
      managerId: user.managerId,
      department: user.department,
    };
  } catch (error) {
    return null;
  }
}
