import { Router } from 'express';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

// TODO: Implement progress operations
// POST /api/progress - Create progress entry

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
