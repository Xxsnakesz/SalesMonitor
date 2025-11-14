import { prisma } from '@/lib/prisma';
import { User } from '@/types';
import { targetRepository } from '../repositories/target.repo';
import { customerRepository } from '../repositories/customer.repo';
import { progressRepository } from '../repositories/progress.repo';

export class ReportService {
  async getDashboardStats(user: User) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    let targetAmount = 0;
    let actualAmount = 0;
    let customerFilters: any = { deletedAt: null };

    if (user.role === 'AM') {
      const target = await targetRepository.findByUser(user.id, month, year);
      targetAmount = target ? Number(target.amount) : 0;
      customerFilters.amId = user.id;
    } else if (user.role === 'GM' && user.departmentId) {
      const target = await targetRepository.findByDepartment(user.departmentId, month, year);
      targetAmount = target ? Number(target.amount) : 0;
      customerFilters.am = {
        departmentId: user.departmentId,
      };
    }

    const closedWonCustomers = await prisma.customer.findMany({
      where: {
        ...customerFilters,
        status: 'closed-won',
        updatedAt: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
    });

    actualAmount = closedWonCustomers.reduce((sum, c) => sum + Number(c.potential), 0);

    const activeCustomers = await prisma.customer.count({
      where: {
        ...customerFilters,
        status: {
          in: ['prospect', 'ongoing', 'proposal', 'negotiation'],
        },
      },
    });

    const pipelineCustomers = await prisma.customer.findMany({
      where: {
        ...customerFilters,
        status: {
          in: ['prospect', 'ongoing', 'proposal', 'negotiation'],
        },
      },
    });

    const pipelineValue = pipelineCustomers.reduce((sum, c) => sum + Number(c.potential), 0);

    const customersByStatus = await prisma.customer.groupBy({
      by: ['status'],
      where: customerFilters,
      _count: { id: true },
      _sum: { potential: true },
    });

    const needsFollowUp = user.role === 'AM'
      ? await customerRepository.findNeedingFollowUp(user.id)
      : [];

    const recentProgress = user.role === 'AM'
      ? await progressRepository.findByAM(user.id, 5)
      : [];

    return {
      targetAmount,
      actualAmount,
      pipelineValue,
      activeCustomers,
      customersByStatus: customersByStatus.map(s => ({
        status: s.status,
        count: s._count.id,
        value: Number(s._sum.potential || 0),
      })),
      needsFollowUp,
      recentProgress,
    };
  }

  async getTargetReport(user: User, month: number, year: number) {
    let targets: any[] = [];

    if (user.role === 'ADMIN') {
      targets = await targetRepository.findAll(month, year);
    } else if (user.role === 'GM' && user.departmentId) {
      const deptTarget = await targetRepository.findByDepartment(user.departmentId, month, year);
      if (deptTarget) targets = [deptTarget];
    } else if (user.role === 'AM') {
      const userTarget = await targetRepository.findByUser(user.id, month, year);
      if (userTarget) targets = [userTarget];
    }

    return targets;
  }
}

export const reportService = new ReportService();
