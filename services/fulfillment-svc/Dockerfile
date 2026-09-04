FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/fulfillment-svc/package.json ./services/fulfillment-svc/

RUN npm install --omit=dev

COPY packages/shared ./packages/shared
COPY services/fulfillment-svc ./services/fulfillment-svc

RUN npx prisma generate --schema=services/fulfillment-svc/prisma/schema.prisma

EXPOSE 4005
CMD ["sh", "-c", "npx prisma db push --schema=services/fulfillment-svc/prisma/schema.prisma --skip-generate && node services/fulfillment-svc/src/server.js"]
