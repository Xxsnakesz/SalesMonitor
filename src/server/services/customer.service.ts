import { customerRepository, CustomerFilters } from '../repositories/customer.repo';
import { User } from '@/types';
import { prisma } from '@/lib/prisma';

export class CustomerService {
  async getCustomers(user: User, filters: CustomerFilters = {}, page = 1, limit = 20) {
    const queryFilters: CustomerFilters = { ...filters };

    if (user.role === 'AM') {
      queryFilters.amId = user.id;
    } else if (user.role === 'GM' && user.departmentId) {
      queryFilters.departmentId = user.departmentId;
    }

    return customerRepository.findAll(queryFilters, page, limit);
  }

  async getCustomerById(id: string, user: User) {
    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (user.role === 'AM' && customer.amId !== user.id) {
      throw new Error('Forbidden');
    }

    if (user.role === 'GM') {
      const customerAM = await customer.am;
      if (customerAM && user.departmentId && customerAM.departmentId !== user.departmentId) {
        throw new Error('Forbidden');
      }
    }

    return customer;
  }

  async createCustomer(data: any, user: User) {
    const amId = user.role === 'AM' ? user.id : data.amId;

    if (!amId) {
      throw new Error('AM ID is required');
    }

    if (user.role === 'GM' || user.role === 'AM') {
      const targetAM = await prisma.user.findUnique({
        where: { id: amId },
        select: { id: true, departmentId: true, deletedAt: true },
      });

      if (!targetAM || targetAM.deletedAt) {
        throw new Error('Invalid AM');
      }

      if (user.role === 'GM' && targetAM.departmentId !== user.departmentId) {
        throw new Error('Cannot create customer for AM outside your department');
      }

      if (user.role === 'AM' && amId !== user.id) {
        throw new Error('AMs can only create customers for themselves');
      }
    }

    return customerRepository.create({
      ...data,
      amId,
      potential: Number(data.potential),
      timeline: data.timeline ? new Date(data.timeline) : undefined,
    });
  }

  async updateCustomer(id: string, data: any, user: User) {
    const customer = await this.getCustomerById(id, user);

    return customerRepository.update(id, {
      ...data,
      potential: data.potential ? Number(data.potential) : undefined,
      timeline: data.timeline ? new Date(data.timeline) : undefined,
    });
  }

  async deleteCustomer(id: string, user: User) {
    await this.getCustomerById(id, user);
    return customerRepository.delete(id);
  }
}

export const customerService = new CustomerService();
