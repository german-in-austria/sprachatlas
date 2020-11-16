/* eslint-disable */
const fs = require('fs')

module.exports = {
  transpileDependencies: [
    'vuetify',
    'vuex-model-decorators'
  ],
  configureWebpack: {
    devtool: 'source-map',
      devServer: {
        open: 'Google Chrome',
        public: 'https://localhost:8080/',
        https: true,
        writeToDisk: true,
      disableHostCheck: true,
      watchOptions: {
        poll: false
      }
    },
    mode: 'development'
  }
}

