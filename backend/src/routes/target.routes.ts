import { Router } from 'express';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

// TODO: Implement target operations
// GET /api/targets - List targets
// POST /api/targets - Create/update target
// DELETE /api/targets/:id - Delete target

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
