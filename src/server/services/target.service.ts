import { targetRepository } from '../repositories/target.repo';
import { User } from '@/types';
import { prisma } from '@/lib/prisma';

export class TargetService {
  async createOrUpdateTarget(data: any, user: User) {
    if (user.role !== 'ADMIN' && user.role !== 'GM') {
      throw new Error('Only admins and GMs can set targets');
    }

    if (user.role === 'GM') {
      if (data.departmentId && data.departmentId !== user.departmentId) {
        throw new Error('GMs can only set targets for their own department');
      }

      if (data.userId) {
        const targetUser = await prisma.user.findUnique({
          where: { id: data.userId },
          select: { departmentId: true, deletedAt: true },
        });

        if (!targetUser || targetUser.deletedAt) {
          throw new Error('Invalid user');
        }

        if (targetUser.departmentId !== user.departmentId) {
          throw new Error('GMs can only set targets for users in their department');
        }
      }

      if (!data.departmentId && !data.userId) {
        data.departmentId = user.departmentId;
      }
    }

    return targetRepository.upsert({
      amount: Number(data.amount),
      currency: data.currency || 'IDR',
      month: data.month,
      year: data.year,
      departmentId: data.departmentId,
      userId: data.userId,
    });
  }

  async getTargets(month: number, year: number, user: User) {
    if (user.role === 'ADMIN') {
      return targetRepository.findAll(month, year);
    } else if (user.role === 'GM' && user.departmentId) {
      const target = await targetRepository.findByDepartment(user.departmentId, month, year);
      return target ? [target] : [];
    } else if (user.role === 'AM') {
      const target = await targetRepository.findByUser(user.id, month, year);
      return target ? [target] : [];
    }

    return [];
  }
}

export const targetService = new TargetService();
