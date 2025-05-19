# Dockerfile for Next.js Frontend (vpn_frontend)

# 1. Build Stage
FROM node:20-alpine AS builder

# Install build tools FIRST (fixed typo and combined RUN commands)
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache git python3 make g++

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm build

# 2. Production Stage
FROM node:20-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Command to run the Next.js application
CMD ["pnpm", "start"]