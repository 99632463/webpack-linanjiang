const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.config.base');
const { dev: { host, port } } = require('../config');

module.exports = env => merge(baseConfig(env), {
  devtool: 'cheap-module-eval-source-map',
  optimization: {
    usedExports: true
  },
  devServer: {
    contentBase: path.join(process.cwd(), 'src'),
    host,
    port,
    overlay: true
  }
})
