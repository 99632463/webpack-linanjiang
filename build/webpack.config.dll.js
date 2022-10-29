const path = require('path');
const webpack = require('webpack');

const cwd = process.cwd();
const library = '[name]_library';

module.exports = {
  mode: 'production',
  entry: {
    jquery: ['jquery'],
    lodash: ['lodash']
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(cwd, 'dll'),
    library
  },
  plugins: [
    new webpack.DllPlugin({
      name: library,
      path: path.join(cwd, 'dll/[name]-manifest.json')
    })
  ]
}