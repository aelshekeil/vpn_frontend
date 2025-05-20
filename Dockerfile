# ----------- Builder Stage ----------- #
FROM node:20-alpine AS builder

# Install system dependencies including libc6-compat for Alpine compatibility
RUN apk add --no-cache git python3 make g++ libc6-compat

# Install latest pnpm and ensure correct version
RUN npm install -g pnpm@8.15.7

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Build application
RUN pnpm build --debug && \
    pnpm prune --prod && \
    rm -rf .next/cache

# ----------- Runtime Stage ----------- #
FROM node:20-alpine

# Use dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Environment configuration
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets from builder
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Runtime configuration
USER node
EXPOSE 3000
CMD ["dumb-init", "node_modules/.bin/next", "start"]