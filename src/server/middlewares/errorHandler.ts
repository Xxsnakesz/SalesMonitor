import { NextApiResponse } from 'next';

export function handleApiError(error: unknown, res: NextApiResponse): void {
  console.error('API Error:', error);

  if (error instanceof Error) {
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
