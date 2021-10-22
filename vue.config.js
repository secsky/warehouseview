// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
 module.exports = {
  publicPath: './',
  // outputDir:'dist',
  // assetsDir:‘static’
    lintOnSave: false,
    devServer:{
      proxy:'http://127.0.0.1:80'
    },
  }