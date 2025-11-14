import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { User } from '@/types';

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> {
  const user = await getCurrentUser(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return user;
}
