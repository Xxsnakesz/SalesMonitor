import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/server/middlewares/requireAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await requireAuth(req, res);
  if (!user) return;

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({ user });
}
