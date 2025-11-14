import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import logger from '@/config/logger';
import { AuthPayload } from '@/middlewares/auth';

interface AuthSocket extends Socket {
  user?: AuthPayload;
}

export const initializeSocket = (io: Server) => {
  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, env.jwt.secret) as AuthPayload;
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    logger.info(`User connected: ${socket.user?.userId}`);

    // Join user-specific room
    if (socket.user) {
      socket.join(`user:${socket.user.userId}`);
      
      // Join role-specific rooms
      socket.join(`role:${socket.user.role}`);
      
      logger.info(`User ${socket.user.userId} joined rooms`);
    }

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user?.userId}`);
    });
  });

  return io;
};

// Export function to emit events (to be used by services)
let ioInstance: Server | null = null;

export const setIoInstance = (io: Server) => {
  ioInstance = io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToRole = (role: string, event: string, data: any) => {
  if (ioInstance) {
    ioInstance.to(`role:${role}`).emit(event, data);
  }
};

export const emitToAll = (event: string, data: any) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};
