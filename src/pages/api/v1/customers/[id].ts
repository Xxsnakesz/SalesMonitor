import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/middlewares/requireAuth';
import { customerService } from '@/server/services/customer.service';
import { updateCustomerSchema } from '@/server/validation/customer.schema';
import { handleApiError } from '@/server/middlewares/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const customer = await customerService.getCustomerById(id as string, user);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json(customer);
    }

    if (req.method === 'PUT') {
      const validatedData = updateCustomerSchema.parse(req.body);
      const customer = await customerService.updateCustomer(id as string, validatedData, user);
      return res.status(200).json(customer);
    }

    if (req.method === 'DELETE') {
      await customerService.deleteCustomer(id as string, user);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    if (error.message === 'Forbidden' || error.message === 'Customer not found') {
      return res.status(404).json({ error: error.message });
    }
    handleApiError(error, res);
  }
}
