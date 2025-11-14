import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { AuthPayload } from '@/middlewares/auth';

export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

export const generateRefreshToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
};

export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.jwt.refreshSecret) as AuthPayload;
};
