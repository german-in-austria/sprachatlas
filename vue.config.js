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
        host: 'localhost',
        port: 8080,
        https: true,
        disableHostCheck: true,
    },
    mode: 'development'
  }
}

