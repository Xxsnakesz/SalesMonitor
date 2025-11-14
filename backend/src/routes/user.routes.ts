import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '@/middlewares/auth';
import { asyncHandler } from '@/middlewares/errorHandler';
import { userService } from '@/services/user.service';
import { createUserSchema, updateUserSchema } from '@/types';
import { z } from 'zod';

const router = Router();

// Protect all user routes - only admins can access
router.use(authenticate);
router.use(authorize('ADMIN'));

// GET /api/users - List all users
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const users = await userService.listUsers();
    res.json({ users });
  })
);

// GET /api/users/departments - Get all departments
router.get(
  '/departments',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const departments = await userService.getDepartments();
    res.json({ departments });
  })
);

// GET /api/users/managers - Get all managers
router.get(
  '/managers',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const managers = await userService.getManagers();
    res.json({ managers });
  })
);

// GET /api/users/:id - Get user by ID
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    res.json({ user });
  })
);

// POST /api/users - Create user
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = createUserSchema.parse(req.body);
    const user = await userService.createUser(data);
    res.status(201).json({ user });
  })
);

// PUT /api/users/:id - Update user
router.put(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(req.params.id, data);
    res.json({ user });
  })
);

// DELETE /api/users/:id - Delete user
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  })
);

// POST /api/users/:id/reset-password - Reset password
router.post(
  '/:id/reset-password',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const schema = z.object({
      password: z.string().min(8, 'Password must be at least 8 characters'),
    });
    const { password } = schema.parse(req.body);
    const result = await userService.resetPassword(req.params.id, password);
    res.json(result);
  })
);

export default router;
