# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install PNPM
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY .pnpmrc ./

# Install dependencies (update lockfile if needed)
RUN pnpm install --no-frozen-lockfile

# Development stage
FROM base AS development
WORKDIR /app
COPY . .
RUN pnpm exec prisma generate
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# Build stage
FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Install PNPM
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY .pnpmrc ./

# Install ALL dependencies (including dev deps for Prisma CLI)
RUN pnpm install --no-frozen-lockfile

# Generate Prisma client in production stage
COPY --from=build --chown=nodeuser:nodejs /app/prisma ./prisma
RUN pnpm exec prisma generate

# Copy built application
COPY --from=build --chown=nodeuser:nodejs /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads && chown nodeuser:nodejs uploads

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js || exit 1

# Start application
CMD ["node", "dist/server.js"]
