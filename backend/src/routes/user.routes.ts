import { Router } from 'express';
import { authenticate, authorize } from '@/middlewares/auth';

const router = Router();

// Protect all user routes - only admins can access
router.use(authenticate);
router.use(authorize('ADMIN'));

// TODO: Implement user CRUD operations
// GET /api/users - List all users
// GET /api/users/:id - Get user by ID
// POST /api/users - Create user
// PUT /api/users/:id - Update user
// DELETE /api/users/:id - Delete user

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
