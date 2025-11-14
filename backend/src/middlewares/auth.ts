import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { AppError } from './errorHandler';
import { Role } from '@prisma/client';

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, env.jwt.secret) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, 'Invalid token'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, 'Token expired'));
    }
    next(error);
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }

    next();
  };
};
