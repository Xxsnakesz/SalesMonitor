import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { env } from './config/env';
import logger from './config/logger';
import prisma from './config/prisma';
import { initializeSocket } from './socket';

const app = createApp();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: env.cors.origin,
    credentials: true,
  },
});

initializeSocket(io);

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  await prisma.$disconnect();
  logger.info('Database connection closed');
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    httpServer.listen(env.port, () => {
      logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
