// TODO:
// Append hash to all changed files - how to approach this?
// Offline and serviceWorker -> https://github.com/NekR/offline-plugin


const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const manifest = require('./dev/manifest.json');


module.exports = {
  context: path.resolve(__dirname, './dev'),
  entry: {
    app: './assets/bundle.js',
  },
  output: {
    path: path.resolve(__dirname, './production'),
    filename: 'assets/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
            presets: ["es2015"]
        }
      },
      {
      test: /\.css$/,
        loader: ExtractTextPlugin.extract({
                  loader: 'css-loader?modules=false&minimize=true&localIdentName=[name]__[local]_[hash:base64:5]!postcss-loader'
                }),
      },
      {
        test: /\.(pdf|txt|xml|json|mp4)$/i, 
        loader: "file-loader?name=[path][name].[ext]"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loaders: [
          "file-loader?name=[path][name].[ext]",
          {
            loader: 'image-webpack-loader',
            query: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              mozjpeg: {
                quality: 80
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("assets/bundle.css"),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      name: manifest.name,
      theme_color: manifest.theme_color,
      template: 'index.ejs',
      hash: true,
      minify: {
        collapseWhitespace: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeComments: true
      }
    }),
  ]
};