FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/customer-web/package.json ./apps/customer-web/

RUN npm install

COPY packages/ui ./packages/ui
COPY apps/customer-web ./apps/customer-web

WORKDIR /app/apps/customer-web
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/apps/customer-web/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
