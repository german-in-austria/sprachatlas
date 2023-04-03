# NODE AND NPM LTS
FROM node:18-alpine as builder

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

ENV NODE_ENV production

USER 1000
EXPOSE 80

# RUN npx cypress verify
FROM scratch
COPY --from=builder /usr/src/app /usr/src/app

# START AND EXPOSE TO HOST-DAEMON
ENTRYPOINT ["/usr/local/bin/npm", "run"]
