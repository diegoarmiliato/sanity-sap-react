const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@src': path.resolve(__dirname, 'src'),
      '@reducers': path.resolve(__dirname, 'src/store/reducers'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  };

  return config;
};