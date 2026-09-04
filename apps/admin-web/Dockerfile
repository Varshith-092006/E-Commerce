FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/admin-web/package.json ./apps/admin-web/

RUN npm install

COPY packages/ui ./packages/ui
COPY apps/admin-web ./apps/admin-web

WORKDIR /app/apps/admin-web
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/apps/admin-web/dist /usr/share/nginx/html
EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
