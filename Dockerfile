FROM node:lts-alpine

RUN mkdir /app && chown node:node /app

COPY . /app
WORKDIR /app

USER node

RUN npm install

EXPOSE $PORT

CMD [ "npm", "start" ]
