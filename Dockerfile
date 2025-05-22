# ----------- Builder Stage ----------- #
FROM node:20-slim AS builder

# Install system dependencies
RUN apt-get update && apt-get install -y git python3 make g++

# Install pnpm globally
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (including devDependencies)
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm build

# ----------- Runtime Stage ----------- #
FROM node:20-slim

# Install dumb-init for signal handling
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@latest

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# Use a non-root user for security
USER node

# Expose the Next.js port
EXPOSE 3000

# Start the application
CMD ["dumb-init", "pnpm", "start"]
