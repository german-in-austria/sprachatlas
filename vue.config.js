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
        https: {
          key: fs.readFileSync('/home/jakob/Documents/sprachatlas_dioe/sprachatlas/cert/dioe.at+4-key.pem'),
          cert: fs.readFileSync('/home/jakob/Documents/sprachatlas_dioe/sprachatlas/cert/dioe.at+4.pem'),  
        },
        writeToDisk: true,
      disableHostCheck: true,
      watchOptions: {
        poll: false
      }
    },
    mode: 'development'
  }
}

