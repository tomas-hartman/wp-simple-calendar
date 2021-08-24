module.exports = {
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
