module.exports = {
  configureWebpack: config => {
    config.output.filename = '[name].js';
    config.output.chunkFilename = '[name].js';
  },
  css: {
    requireModuleExtension: false,
    loaderOptions: {
      css: {
        modules: {
          mode: 'global',
          getLocalIdent: false,
        },
      },
    },
  },
};
