import { Router } from 'express';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.use(authenticate);

// TODO: Implement customer operations
// GET /api/customers - List customers
// GET /api/customers/:id - Get customer by ID
// POST /api/customers - Create customer
// PUT /api/customers/:id - Update customer
// DELETE /api/customers/:id - Delete customer

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
