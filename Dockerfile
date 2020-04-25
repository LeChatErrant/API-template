FROM node:lts-alpine

RUN mkdir /app && chown node:node /app

COPY . /app
WORKDIR /app

USER node

ENV NODE_ENV=production
RUN npm install --no-optional

EXPOSE $PORT

CMD [ "npm", "start" ]
