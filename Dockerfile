# Dockerfile for Next.js Frontend (vpn_frontend)
# 1. Build Stage
FROM node:20-alpine AS builder

# Install build tools
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache git python3 make g++

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN pnpm build

# 2. Production Stage
FROM node:20-alpine

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "start"]