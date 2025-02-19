# syntax = docker/dockerfile:experimental
FROM node:20.4.0-alpine3.17 as builder
# ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

# RUN yarn && yarn build

FROM nginx:alpine
LABEL authors="Eden"

RUN mkdir -p /usr/share/nginx/html/ui
COPY --from=builder /app/dist /usr/share/nginx/html/ui

RUN chown -R nginx:nginx /usr/share/nginx/html/ui

EXPOSE 80
