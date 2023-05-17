# NODE AND NPM LTS
FROM node:18-alpine as builder

ARG APP_PORT=3333
# CREATE APP DIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# INSTALL DEPENDENCIES
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# DEPENDENCIES FOR CYPRESS
# RUN apt-get update && apt-get install -y \
#   libgtk2.0-0 \
#   libgtk-3-0 \
#   libgbm-dev \
#   libnotify-dev \
#   libgconf-2-4 \
#   libnss3 \
#   libxss1 \
#   libasound2 \
#   libxtst6 \
#   xauth \
#   xvfb

# ARG SENTRY_TOKEN
# ARG BUILD_ID

RUN npm install

COPY . /usr/src/app

RUN npm run build

ENV VUE_APP_DB_ENDPOINT https://dioedb.dioe.at
ENV VUE_APP_API_ENDPOINT https://api.dioe.at/api
ENV NODE_ENV production
ENV NODE_PORT $APP_PORT

USER 1000
EXPOSE $NODE_PORT

# START AND EXPOSE TO HOST-DAEMON
ENTRYPOINT ["/usr/local/bin/npm", "run"]
