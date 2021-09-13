# NODE AND NPM LTS
FROM node:10

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

ENV NODE_ENV production

RUN npm run build

# RUN npx cypress verify

# START AND EXPOSE TO HOST-DAEMON
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/npm", "run"]