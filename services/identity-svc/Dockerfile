FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/identity-svc/package.json ./services/identity-svc/

RUN npm install --omit=dev

COPY packages/shared ./packages/shared
COPY services/identity-svc ./services/identity-svc

RUN npx prisma generate --schema=services/identity-svc/prisma/schema.prisma

EXPOSE 4001
CMD ["sh", "-c", "npx prisma db push --schema=services/identity-svc/prisma/schema.prisma --skip-generate && node services/identity-svc/src/server.js"]
