# ----------- Builder Stage ----------- #
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y git python3 make g++
RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .

# Verify file existence
RUN ls -la src/globals.css && \
    ls -la src/app/layout.tsx && \
    ls -la "src/app/(app)/layout.tsx"

RUN pnpm build

# ----------- Runtime Stage ----------- #
FROM node:20-slim

RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/src/globals.css ./src/
COPY --from=builder /app/.next/static/css ./.next/static/css

RUN npm install -g pnpm@latest && \
    pnpm install --prod

USER node
EXPOSE 3000

CMD ["dumb-init", "pnpm", "start"]