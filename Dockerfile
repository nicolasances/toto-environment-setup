FROM node:9-jessie

RUN mkdir /app

COPY . /app/

CMD node /app/index.js
