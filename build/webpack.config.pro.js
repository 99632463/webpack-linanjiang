const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.config.base');
const { build: { assetsDirectory } } = require('../config');

module.exports = env => merge(baseConfig(env), {
  devtool: 'cleap-module-source-map',
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CopyPlugin([
      { from: assetsDirectory, to: assetsDirectory }
    ]),
    // new BundleAnalyzerPlugin()
  ]
})
