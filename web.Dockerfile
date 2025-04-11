FROM node:20

WORKDIR /web

COPY ./web/package.json ./web/package-lock.json ./
RUN npm install

COPY ./web/ .

RUN npm run build

RUN rm -rf .git/
RUN rm -rf node_module

EXPOSE 3000
EXPOSE 24678
