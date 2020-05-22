FROM node:lts-alpine

RUN mkdir /app && mkdir /app/logs -p && chown node: /app -R

COPY . /app
WORKDIR /app

USER node

RUN npm install --no-optional
RUN npm run build

EXPOSE $PORT

CMD [ "npm", "start" ]
