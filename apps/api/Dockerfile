FROM oven/bun:1.2.5-slim as base

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

COPY --link apps/api/bun.lockb apps/api/package.json ./
RUN bun install --ci

COPY --link apps/api ./

FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD [ "bun", "run", "start" ]
