import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/middlewares/requireAuth';
import { customerService } from '@/server/services/customer.service';
import { createCustomerSchema } from '@/server/validation/customer.schema';
import { handleApiError } from '@/server/middlewares/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    if (req.method === 'GET') {
      const { status, page = '1', limit = '20' } = req.query;
      
      const result = await customerService.getCustomers(
        user,
        { status: status as string },
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const validatedData = createCustomerSchema.parse(req.body);
      const customer = await customerService.createCustomer(validatedData, user);
      return res.status(201).json(customer);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleApiError(error, res);
  }
}
