# ----------- Builder Stage ----------- #
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y git python3 make g++ dos2unix
RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Convert Windows line endings to Linux
RUN find . -type f -print0 | xargs -0 dos2unix

# Verify files with absolute paths
RUN  -la /src/app/globals.css && \
     -la /src/app/app/layout.tsx && \
     -la "/src/app/(app)/layout.tsx"

RUN pnpm build

# ----------- Runtime Stage ----------- #
FROM node:20-slim
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/src/globals.css ./src/
RUN npm install -g pnpm@latest && pnpm install --prod
USER node
EXPOSE 3000
CMD ["dumb-init", "pnpm", "start"]