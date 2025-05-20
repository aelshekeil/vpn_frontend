# Dockerfile for Next.js Frontend (vpn_frontend)
FROM node:20-alpine AS builder

# Install build tools with cache and required dependencies
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache git python3 make g++ && \
    npm install -g npm@10.8.2 pnpm@latest

WORKDIR /app

# Copy package files with proper permissions
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Install dependencies with frozen lockfile and cache
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --force && \
    pnpm add -D tailwindcss postcss autoprefixer

# Copy application code with proper permissions
COPY --chown=node:node . .

# Build application with production environment
ENV NODE_ENV=production
RUN pnpm add -w sharp && \
    pnpm build && \
    rm -rf .next/cache

# Production stage
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets with proper permissions
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

# Add missing dependencies for production
RUN apk add --no-cache curl && \
    npm cache clean --force

EXPOSE 3000
CMD ["pnpm", "start"]