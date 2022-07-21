/* eslint-disable */
const fs = require('fs');

module.exports = {
  transpileDependencies: true,
  lintOnSave: true,
  configureWebpack: {
    devtool: 'source-map',
    devServer: {
      host: 'localhost',
      port: 8080,
      https: true,
      allowedHosts: 'all'
    },
    mode: 'development'
  }
};
