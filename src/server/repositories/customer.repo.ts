import { prisma } from '@/lib/prisma';

export interface CustomerFilters {
  amId?: string;
  status?: string;
  departmentId?: string;
}

export class CustomerRepository {
  async findAll(filters: CustomerFilters = {}, page = 1, limit = 20) {
    const where: any = { deletedAt: null };

    if (filters.amId) {
      where.amId = filters.amId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.departmentId) {
      where.am = {
        departmentId: filters.departmentId,
      };
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          am: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total, page, limit };
  }

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        am: {
          select: {
            id: true,
            name: true,
          },
        },
        progresses: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    });
  }

  async create(data: {
    amId: string;
    companyName: string;
    pic: string;
    phone: string;
    email?: string;
    potential: number;
    timeline?: Date;
    status: string;
  }) {
    return prisma.customer.create({
      data,
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

  async update(id: string, data: Partial<{
    companyName: string;
    pic: string;
    phone: string;
    email?: string;
    potential: number;
    timeline?: Date;
    status: string;
  }>) {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findNeedingFollowUp(amId: string, days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return prisma.customer.findMany({
      where: {
        amId,
        deletedAt: null,
        status: {
          in: ['prospect', 'ongoing', 'proposal', 'negotiation'],
        },
        OR: [
          {
            progresses: {
              none: {},
            },
          },
          {
            progresses: {
              every: {
                date: {
                  lt: cutoffDate,
                },
              },
            },
          },
        ],
      },
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
}

export const customerRepository = new CustomerRepository();
