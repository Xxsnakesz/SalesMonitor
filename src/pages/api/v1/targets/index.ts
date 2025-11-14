import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/middlewares/requireAuth';
import { requireRole } from '@/server/middlewares/requireRole';
import { targetService } from '@/server/services/target.service';
import { createTargetSchema } from '@/server/validation/target.schema';
import { handleApiError } from '@/server/middlewares/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    if (req.method === 'GET') {
      const { month, year } = req.query;
      const currentDate = new Date();
      
      const targets = await targetService.getTargets(
        month ? parseInt(month as string) : currentDate.getMonth() + 1,
        year ? parseInt(year as string) : currentDate.getFullYear(),
        user
      );

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json(targets);
    }

    if (req.method === 'POST') {
      if (!requireRole(user, ['ADMIN', 'GM'], res)) return;

      const validatedData = createTargetSchema.parse(req.body);
      const target = await targetService.createOrUpdateTarget(validatedData, user);
      return res.status(201).json(target);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    if (error.message === 'Only admins and GMs can set targets') {
      return res.status(403).json({ error: error.message });
    }
    handleApiError(error, res);
  }
}
