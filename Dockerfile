# Dockerfile for Next.js Frontend (vpn_frontend)

# 1. Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Enable corepack for pnpm (built into Node.js)
RUN corepack enable

# Copy package.json and pnpm-lock.yaml (or package-lock.json/yarn.lock)
COPY package.json pnpm-lock.yaml* ./
# If not using pnpm, adjust to: COPY package.json package-lock.json ./
# Or: COPY package.json yarn.lock ./

# Install dependencies

# Install dependencies with lockfile fix
RUN pnpm install --frozen-lockfile

# If not using pnpm, adjust to: RUN npm ci
# Or: RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set build-time arguments for Next.js (if needed, e.g., NEXT_PUBLIC_API_URL)
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the Next.js application
RUN pnpm build
# If not using pnpm, adjust to: RUN npm run build
# Or: RUN yarn build

# 2. Production Stage
FROM node:20-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# If using pnpm and it's needed for `next start` with a standalone output, copy node_modules as well
# COPY --from=builder /app/node_modules ./node_modules 
# However, for standalone output, node_modules are often bundled or not needed in this way.
# If your `next build` produces a standalone output (check next.config.js output: 'standalone'),
# you might only need to copy the .next/standalone and .next/static folders.
# Example for standalone output (adjust paths as per your build output):
# COPY --from=builder /app/.next/standalone ./ 
# COPY --from=builder /app/.next/static ./.next/static

# Expose port 3000
EXPOSE 3000

# Command to run the Next.js application
# Coolify will likely use this or its own start command based on the detected framework.
# If using pnpm:
CMD ["pnpm", "start"]
# If using npm:
# CMD ["npm", "start"]
# If using yarn:
# CMD ["yarn", "start"]

# Note: For a more optimized production build, especially if not using `output: 'standalone'` in next.config.js,
# you might need to copy `node_modules` from the builder stage if `next start` requires them.
# If `output: 'standalone'` is used in `next.config.js`, the build output in `.next/standalone` 
# is self-contained and often doesn't require the full `node_modules` directory in the final image.
# The template `create_nextjs_app` might not have `output: 'standalone'` by default.
# If issues arise, ensure `next.config.js` is configured for optimal Docker deployment (e.g., with `output: 'standalone'`).

