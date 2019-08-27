const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: { snowplow: './assets/js/snowplow.js' },
  output: {
    path: path.resolve(__dirname, 'assets/js/dist'),
    filename: '[name].js'
  },
  mode: 'production',
  devtool: 'source-map', // eval
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: [ '/node_modules/', '/bower_components' ]
      },
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin({
        sourceMap: true
    })],
  },
}