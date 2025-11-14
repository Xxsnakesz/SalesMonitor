import { prisma } from '@/lib/prisma';

export class TargetRepository {
  async findByUser(userId: string, month: number, year: number) {
    return prisma.target.findFirst({
      where: {
        userId,
        month,
        year,
      },
    });
  }

  async findByDepartment(departmentId: string, month: number, year: number) {
    return prisma.target.findFirst({
      where: {
        departmentId,
        month,
        year,
      },
    });
  }

  async findAll(month: number, year: number) {
    return prisma.target.findMany({
      where: {
        month,
        year,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: {
    amount: number;
    currency: string;
    month: number;
    year: number;
    departmentId?: string;
    userId?: string;
  }) {
    return prisma.target.create({
      data,
    });
  }

  async upsert(data: {
    amount: number;
    currency: string;
    month: number;
    year: number;
    departmentId?: string;
    userId?: string;
  }) {
    const existing = data.userId
      ? await this.findByUser(data.userId, data.month, data.year)
      : data.departmentId
      ? await this.findByDepartment(data.departmentId, data.month, data.year)
      : null;

    if (existing) {
      return prisma.target.update({
        where: { id: existing.id },
        data: { amount: data.amount },
      });
    }

    return this.create(data);
  }
}

export const targetRepository = new TargetRepository();
