FROM node:20-alpine as build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

# Copy dependency files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine as prod

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /usr/app/dist .

CMD ["node", "main.js"]
