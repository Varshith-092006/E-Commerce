FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/order-svc/package.json ./services/order-svc/

RUN npm install --omit=dev

COPY packages/shared ./packages/shared
COPY services/order-svc ./services/order-svc

RUN npx prisma generate --schema=services/order-svc/prisma/schema.prisma

EXPOSE 4003
CMD ["sh", "-c", "npx prisma db push --schema=services/order-svc/prisma/schema.prisma --skip-generate && node services/order-svc/src/server.js"]
