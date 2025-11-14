import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/middlewares/requireAuth';
import { progressRepository } from '@/server/repositories/progress.repo';
import { createProgressSchema } from '@/server/validation/progress.schema';
import { handleApiError } from '@/server/middlewares/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    if (req.method === 'GET') {
      const { customerId } = req.query;
      
      if (customerId) {
        const progress = await progressRepository.findByCustomer(customerId as string);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.status(200).json(progress);
      }

      const progress = await progressRepository.findByAM(user.id);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json(progress);
    }

    if (req.method === 'POST') {
      const validatedData = createProgressSchema.parse(req.body);
      const progress = await progressRepository.create({
        ...validatedData,
        amId: user.id,
      });
      return res.status(201).json(progress);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleApiError(error, res);
  }
}
