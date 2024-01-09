# NODE AND NPM LTS
FROM node:18-alpine as builder

ARG APP_PORT=3333
# CREATE APP DIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# INSTALL DEPENDENCIES
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

ENV VUE_APP_DB_ENDPOINT https://dioedb.dioe.at
ENV VUE_APP_API_ENDPOINT https://api.dioe.at/api
ENV NODE_PORT $APP_PORT

RUN npm install

COPY . /usr/src/app

RUN npm run build

ENV NODE_ENV production

USER 1000
EXPOSE $NODE_PORT

# START AND EXPOSE TO HOST-DAEMON
ENTRYPOINT ["/usr/local/bin/npm", "run"]
