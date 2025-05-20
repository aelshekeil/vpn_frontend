# ----------- Builder Stage ----------- #
FROM node:20-alpine AS builder

# Install build tools with cache and required dependencies
RUN apk add --no-cache git python3 make g++ libc6-compat  # Added libc6-compat
    npm install -g pnpm@8.15.7

WORKDIR /app

# Copy package files only (no source yet)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (with flexibility for lock file)
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install; \
    else \
      pnpm install; \
    fi

# Copy full source code
COPY . .

# Build Next.js app
RUN pnpm build --debug && \
    pnpm prune --prod && \
    rm -rf .next/cache

# ----------- Runtime Stage ----------- #
FROM node:20-alpine

# Use dumb-init for signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what is needed for runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set proper permissions
RUN chown -R node:node /app

# Run as non-root user
USER node

# Expose port
EXPOSE 3000

# Start app with dumb-init for proper signal handling
CMD ["dumb-init", "node_modules/.bin/next", "start"]