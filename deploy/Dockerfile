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

EXPOSE 8080
