# Dockerfile for Next.js Frontend (vpn_frontend)
FROM node:20-alpine AS builder

# Install build tools with cache
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache git python3 make g++

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]