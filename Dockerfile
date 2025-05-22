# ----------- Builder Stage ----------- #
FROM node:20-slim AS builder

# Install system dependencies
RUN apt-get update && apt-get install -y git python3 make g++

# Install pnpm globally
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy application files
COPY . .

# Verify file existence (with proper quoting)
RUN ls -la src/ && \
    ls -la src/app/ && \
    ls -la "src/app/(app)/"

# Build the application
RUN pnpm build

# ----------- Runtime Stage ----------- #
FROM node:20-slim

# Install dumb-init
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

# Copy necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/src/globals.css ./src/

# Install production dependencies
RUN npm install -g pnpm@latest && \
    pnpm install --prod

# Use non-root user
USER node

EXPOSE 3000

CMD ["dumb-init", "pnpm", "start"]