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
    filename: './assets/bundle.js',
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
                  loader: 'css-loader!postcss-loader'
                }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, 
        loader: "file-loader?name=[path][name].[ext]"
      },
      {
        test: /\.(pdf|txt|xml|json|mp4)$/i, 
        loader: "file-loader?name=[path][name].[ext]"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("./assets/bundle.css"),
    new HtmlWebpackPlugin({
      name: manifest.name,
      theme_color: manifest.theme_color,
      template: 'index.ejs',
      hash: false,
      minify: false,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "production"),
    compress: false,
    port: 8080,
    watchContentBase: true,
    watchOptions: {
      poll: true
    },
    inline: true,
    lazy: false
  },
  watch: false,
};