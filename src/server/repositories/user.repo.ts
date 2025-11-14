import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });
  }

  async findByRole(role: Role) {
    return prisma.user.findMany({
      where: { role, deletedAt: null },
      include: {
        department: true,
      },
    });
  }

  async findByDepartment(departmentId: string) {
    return prisma.user.findMany({
      where: { departmentId, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
