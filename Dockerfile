FROM node:20-alpine as build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:20-alpine as prod

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

COPY --from=build /usr/app/dist .

RUN pnpm ci --omit=dev

CMD ["node", "main.js"]
