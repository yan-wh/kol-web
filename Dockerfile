FROM node:8.11.1 as builder

MAINTAINER Lihong "lihong@haplox.com"

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm config set puppeteer_skip_chromium_download true -g
# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
# RUN cnpm install
RUN npm config set registry https://registry.npm.taobao.org/
RUN npm install
RUN npm run build


# multi-stage builds
FROM nginx:stable

MAINTAINER Lihong "lihong@haplox.com"

RUN rm -rf /usr/share/nginx/html/* && mkdir -p /usr/share/nginx/html/boilerplate
COPY --from=builder /app/dist /usr/share/nginx/html/boilerplate
RUN mv /usr/share/nginx/html/boilerplate/index.html /usr/share/nginx/html/index.html
COPY default.conf /etc/nginx/conf.d/default.conf
