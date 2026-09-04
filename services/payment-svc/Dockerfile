FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/payment-svc/package.json ./services/payment-svc/

RUN npm install --omit=dev

COPY packages/shared ./packages/shared
COPY services/payment-svc ./services/payment-svc

RUN npx prisma generate --schema=services/payment-svc/prisma/schema.prisma

EXPOSE 4004
CMD ["sh", "-c", "npx prisma db push --schema=services/payment-svc/prisma/schema.prisma --skip-generate && node services/payment-svc/src/server.js"]
