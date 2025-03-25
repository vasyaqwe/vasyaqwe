FROM oven/bun:1.2.5-slim

ENV NODE_ENV="production"

WORKDIR /app

COPY package.json .
COPY turbo.json .
COPY tooling/typescript/package.json tooling/typescript/
COPY apps/api/package.json apps/api/

RUN bun install --production && bun install turbo@^2.3.3 -g

COPY tooling/typescript tooling/typescript
COPY apps/api apps/api

RUN bun run turbo build

EXPOSE 8080
CMD [ "bun", "run", "--cwd", "/app/apps/api", "start" ]