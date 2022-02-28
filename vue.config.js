module.exports = {
  filenameHashing: process.env.NODE_ENV !== 'production',
  css: {
    // requireModuleExtension: false,
    loaderOptions: {
      css: {
        modules: {
          mode: 'global',
          // getLocalIdent: false,
        },
      },
    },
  },
  chainWebpack: config => {
    config.entryPoints.delete('app');

    config.entry('admin')
      .add('./src/admin.ts')
      .end()
      .entry('public')
      .add('./src/client.ts')
      .end();
  },
};
