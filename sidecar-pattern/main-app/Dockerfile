FROM oven/bun:1.2-slim AS deps
WORKDIR /app
COPY shared ./shared
COPY main-app/package.json main-app/bun.lock ./main-app/
WORKDIR /app/main-app
RUN bun install --frozen-lockfile --production

FROM oven/bun:1.2-slim 
WORKDIR /app
COPY --from=deps /app/main-app/node_modules /app/main-app/node_modules
COPY shared ./shared
COPY main-app ./main-app
WORKDIR /app/main-app
EXPOSE 8080
CMD ["bun", "run", "start"]
