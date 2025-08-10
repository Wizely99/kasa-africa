# syntax=docker/dockerfile:1

FROM node:22-slim AS base
WORKDIR /app
RUN corepack enable

# Dependencies stage
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile --prod

# Build stage
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm add sharp && pnpm build

# Production distroless image
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

EXPOSE 3000
CMD ["server.js"]