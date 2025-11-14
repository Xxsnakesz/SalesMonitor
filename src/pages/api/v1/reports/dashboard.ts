import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/middlewares/requireAuth';
import { reportService } from '@/server/services/report.service';
import { handleApiError } from '@/server/middlewares/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    const stats = await reportService.getDashboardStats(user);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json(stats);
  } catch (error) {
    handleApiError(error, res);
  }
}
