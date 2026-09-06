FROM oven/bun:1.2-slim AS deps
WORKDIR /app
COPY shared ./shared
COPY sidecar/package.json sidecar/bun.lock ./sidecar/
WORKDIR /app/sidecar
RUN bun install --frozen-lockfile --production

FROM oven/bun:1.2-slim 
WORKDIR /app
COPY --from=deps /app/sidecar/node_modules ./sidecar/node_modules
COPY shared ./shared
COPY sidecar ./sidecar
WORKDIR /app/sidecar
EXPOSE 9090
CMD ["bun", "run", "start"]