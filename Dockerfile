# NODE AND NPM LTS
FROM node:22-alpine as builder

# CREATE APP DIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# INSTALL DEPENDENCIES
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

ENV NODE_PORT=3000

RUN npm install

# Copy files
COPY . /usr/src/app

RUN npm run build

ENV NODE_ENV production

USER 1000
EXPOSE $NODE_PORT

# START AND EXPOSE TO HOST-DAEMON
ENTRYPOINT ["/usr/local/bin/npm", "run" , "start"]
