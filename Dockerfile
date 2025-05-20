# ----------- Builder Stage ----------- #
FROM node:20-alpine AS builder

# Install build tools with cache and required dependencies
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache git python3 make g++ && \
    npm install -g npm@10.8.2 pnpm@8.15.7

WORKDIR /app

# Avoid workspace root check and lockfile config mismatch
RUN echo "ignore-workspace-root-check=true" > .npmrc && \
    echo "onlyBuiltDependencies=false" >> .npmrc

# Copy package files only (no source yet)
COPY --chown=node:node package.json pnpm-lock.yaml ./

# Install dependencies (respect lockfile config)
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Install additional dev dependencies
RUN pnpm add -D @types/node@20.17.48 tailwindcss@4.1.7 postcss@8.5.3 autoprefixer@10.4.21

# Copy full source code
COPY --chown=node:node . .

# Build Next.js app and remove cache
RUN pnpm add -w sharp@0.34.1 && \
    pnpm build && \
    pnpm prune --prod && \
    rm -rf .next/cache

# ----------- Runtime Stage ----------- #
FROM node:20-alpine

# Use dumb-init for signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what is needed for runtime
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

# Security best practices
USER node
EXPOSE 3000

# Start app with dumb-init for proper signal handling
CMD ["dumb-init", "pnpm", "start"]
