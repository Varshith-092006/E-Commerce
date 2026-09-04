FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/notification-svc/package.json ./services/notification-svc/

RUN npm install --omit=dev

COPY packages/shared ./packages/shared
COPY services/notification-svc ./services/notification-svc

RUN npx prisma generate --schema=services/notification-svc/prisma/schema.prisma

EXPOSE 4006
CMD ["sh", "-c", "npx prisma db push --schema=services/notification-svc/prisma/schema.prisma --skip-generate && node services/notification-svc/src/server.js"]
