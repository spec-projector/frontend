FROM node:10.13 as build

WORKDIR /src

COPY package.json .
RUN npm install

COPY . .
RUN npm run build


FROM nginx:1.17.4-alpine

WORKDIR /var/www

COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist .

RUN addgroup -S -g 10001 app \
    && adduser -S -u 10001 \
        -s /sbin/false \
        -G app \
        -H -h /app  \
        app \
    && mkdir /var/run/nginx \
    && chown app:app /var/run/nginx \
    && ln -sf /dev/stderr /var/run/nginx/error.log

USER app

EXPOSE 8080
