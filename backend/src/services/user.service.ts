import prisma from '@/config/prisma';
import { hashPassword } from '@/utils/password';
import { AppError } from '@/middlewares/errorHandler';
import { Role } from '@prisma/client';

export class UserService {
  async listUsers() {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        departmentId: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        departmentId: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async createUser(data: {
    email: string;
    name: string;
    password: string;
    role: Role;
    departmentId?: string;
    managerId?: string;
    username?: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new AppError(400, 'User with this email or username already exists');
    }

    // Validate department if provided
    if (data.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!department) {
        throw new AppError(400, 'Department not found');
      }
    }

    // Validate manager if provided
    if (data.managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: data.managerId },
      });
      if (!manager) {
        throw new AppError(400, 'Manager not found');
      }
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        departmentId: data.departmentId,
        managerId: data.managerId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        departmentId: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  async updateUser(
    id: string,
    data: {
      email?: string;
      name?: string;
      role?: Role;
      departmentId?: string | null;
      managerId?: string | null;
      username?: string | null;
    }
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError(404, 'User not found');
    }

    // Check email/username uniqueness if changing
    if (data.email || data.username) {
      const conflictingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                data.email ? { email: data.email } : {},
                data.username ? { username: data.username } : {},
              ].filter(obj => Object.keys(obj).length > 0),
            },
          ],
        },
      });

      if (conflictingUser) {
        throw new AppError(400, 'Email or username already in use');
      }
    }

    // Validate department if provided
    if (data.departmentId !== undefined && data.departmentId !== null) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!department) {
        throw new AppError(400, 'Department not found');
      }
    }

    // Validate manager if provided
    if (data.managerId !== undefined && data.managerId !== null) {
      const manager = await prisma.user.findUnique({
        where: { id: data.managerId },
      });
      if (!manager) {
        throw new AppError(400, 'Manager not found');
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        departmentId: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'User deleted successfully' };
  }

  async resetPassword(id: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password reset successfully' };
  }

  async getDepartments() {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return departments;
  }

  async getManagers() {
    const managers = await prisma.user.findMany({
      where: {
        deletedAt: null,
        role: {
          in: ['ADMIN', 'GM'],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return managers;
  }
}

export const userService = new UserService();
