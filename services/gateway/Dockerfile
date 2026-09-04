FROM node:20-alpine AS base
WORKDIR /app

# Copy root workspace configurations
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/gateway/package.json ./services/gateway/

RUN npm install --omit=dev

COPY packages/shared ./packages/shared
COPY services/gateway ./services/gateway

EXPOSE 4000
CMD ["node", "services/gateway/src/server.js"]
