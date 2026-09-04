FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/catalog-svc/package.json ./services/catalog-svc/

RUN npm install --omit=dev

COPY packages/shared ./packages/shared
COPY services/catalog-svc ./services/catalog-svc

RUN npx prisma generate --schema=services/catalog-svc/prisma/schema.prisma

EXPOSE 4002
CMD ["sh", "-c", "npx prisma db push --schema=services/catalog-svc/prisma/schema.prisma --skip-generate && node services/catalog-svc/src/server.js"]
