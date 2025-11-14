import { prisma } from '@/lib/prisma';

export class ProgressRepository {
  async findByCustomer(customerId: string) {
    return prisma.progress.findMany({
      where: { customerId },
      orderBy: { date: 'desc' },
      include: {
        am: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByAM(amId: string, limit = 10) {
    return prisma.progress.findMany({
      where: { amId },
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        customer: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
  }

  async create(data: {
    customerId: string;
    amId: string;
    description: string;
    status: string;
    date?: Date;
  }) {
    return prisma.progress.create({
      data: {
        ...data,
        date: data.date || new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
  }
}

export const progressRepository = new ProgressRepository();
