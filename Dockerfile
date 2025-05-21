# ----------- Builder Stage ----------- #
FROM node:20-slim AS builder

# Install system dependencies
RUN apt-get update && apt-get install -y git python3 make g++

# Install pnpm
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (including devDependencies)
RUN pnpm install --force

# Copy source files
COPY public ./public
COPY src ./src
COPY tailwind.config.ts postcss.config.ts next.config.js ./

# Build application
RUN pnpm build

# ----------- Runtime Stage ----------- #
FROM node:20-slim

# Use dumb-init for proper signal handling
RUN apt-get update && apt-get install -y dumb-init && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Environment configuration
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets from builder
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Install production dependencies only
RUN pnpm install --prod

# Runtime configuration
USER node
EXPOSE 3000
CMD ["dumb-init", "node_modules/.bin/next", "start"]