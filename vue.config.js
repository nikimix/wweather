const {defineConfig} = require('@vue/cli-service');

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.customElement = true;
        return options;
      });
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/wweather/' : '/',
});
