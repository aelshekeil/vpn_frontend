# Dockerfile for Next.js Frontend (vpn_frontend)
FROM node:20-alpine AS builder

# Install build tools with cache and required dependencies
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache git python3 make g++ && \
    npm install -g npm@10.8.2 pnpm@8.15.7

WORKDIR /app

# Create .npmrc to suppress workspace warnings
RUN echo "ignore-workspace-root-check=true" > .npmrc

# Copy package files with proper permissions
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Install dependencies with frozen lockfile and cache
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --force && \
    pnpm add -D @types/node@20.17.48 tailwindcss@4.1.7 postcss@8.5.3 autoprefixer@10.4.21

# Copy application code with proper permissions
COPY --chown=node:node . .

# Build application with production environment
RUN pnpm add -w sharp@0.34.1 && \
    pnpm build && \
    pnpm prune --prod && \
    rm -rf .next/cache

# Production stage
FROM node:20-alpine
RUN apk add --no-cache dumb-init  # <-- This installs it
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets with proper permissions
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

# Install runtime dependencies
RUN apk add --no-cache dumb-init

# Security best practices
USER node
EXPOSE 3000

# Use dumb-init to handle proper signal handling
CMD ["dumb-init", "pnpm", "start"]