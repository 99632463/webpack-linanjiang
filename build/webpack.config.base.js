const HtmlPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob');
const webpack = require('webpack');
const HappyPack = require('happypack');
const path = require('path');
const fs = require('fs');
const { base: { webTitle } } = require('../config');

const resolve = dir => {
  return path.join(process.cwd(), dir)
}

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contentHash:4].css',
  }),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  }),
  new PurgecssPlugin({
    paths: glob.sync(`${resolve('src')}/**/*`, { nodir: true }),
  }),
  new HappyPack({
    id: 'js',
    loaders: ['babel-loader']
  })
];

const config = ({ ENVIRONMENT }) => {
  const configObject = {
    mode: ENVIRONMENT,
    entry: {
      index: './src',
      detail: './src/detail',
    },
    output: {
      filename: 'js/[name].[contentHash:4].js',
      path: resolve('dist')
    },
    module: {
      noParse: /jquery|lodash|moment|axios/,
      rules: [
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          loader: "happypack/loader?id=js"
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/i,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(jpe?g|png|svg|bmp|gif)$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name].[contentHash:4].[ext]',
                outputPath: 'images/',
                limit: 1024 * 4
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                }
              }
            },
          ]
        },
        {
          test: /\.(eot|svg|ttf|woff2?)$/i,
          exclude: /node_modules/,
          loader: 'file-loader',
          options: {
            name: '[name].[contentHash:4].[ext]',
            outputPath: 'fonts/'
          }
        }
      ]
    }
  }

  configObject.plugins = makePlugins(configObject);

  return configObject;
}

const makePlugins = ({ entry }) => {
  Object.keys(entry).forEach(key => {
    plugins.push(new HtmlPlugin({
      title: webTitle,
      filename: `${key}.html`,
      template: './src/index.html',
      chunks: [
        `${key}`,
        `vendors~${key}`,
        `vendors~detail~index`,
        `vendors~index~detail`
      ],
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }))
  })

  addDynamicLinkPlugin();

  return plugins;
}

const addDynamicLinkPlugin = () => {
  const files = fs.readdirSync(resolve('dll'));
  (files || []).forEach(file => {
    file.endsWith('.js') ?
      plugins.push(new AddAssetHtmlPlugin({
        filepath: resolve(`dll/${file}`)
      }))
      :
      plugins.push(new webpack.DllReferencePlugin({
        manifest: require(`../dll/${file}`)
      }))
  });
}

module.exports = env => config(env);
