FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/seller-web/package.json ./apps/seller-web/

RUN npm install

COPY packages/ui ./packages/ui
COPY apps/seller-web ./apps/seller-web

WORKDIR /app/apps/seller-web
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/apps/seller-web/dist /usr/share/nginx/html
EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]
