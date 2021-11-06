module.exports = {
  filenameHashing: process.env.NODE_ENV !== 'production',
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
