import { Router } from 'express';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

// TODO: Implement dashboard operations
// GET /api/dashboard/stats - Get dashboard statistics
// GET /api/dashboard/charts - Get chart data

router.get('/stats', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
