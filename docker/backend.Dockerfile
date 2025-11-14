# Multi-stage build for Backend

# Stage 1: Dependencies
FROM node:20-slim AS deps

WORKDIR /app

# Install OpenSSL and other dependencies for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL
RUN apt-get update && apt-get install -y \
    openssl \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies and prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY backend/ ./

# Build the application
RUN npm run build

# Stage 3: Production
FROM node:20-slim AS runner

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set environment
ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]