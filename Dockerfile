FROM node:20-alpine as build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

COPY pnpm-lock.yaml .
COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:20-alpine as prod

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

COPY pnpm-lock.yaml .
COPY package.json .

RUN pnpm install --prod

COPY --from=build /usr/app/dist .

CMD ["node", "main.js"]
