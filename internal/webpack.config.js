
const path = require('path')
const webpack = require('webpack')
const appRoot = require('app-root-path').path
const { getMode } = require('./util')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = {
  mode: getMode(process.env.NODE_ENV),
  entry: {
    app: path.join(appRoot, 'index.js')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(appRoot, '/dist/lib'),
    publicPath: '/lib/'
  },
  devServer: {
    contentBase: path.join(appRoot, '/dist'),
    publicPath: '/lib/',
    compress: true,
    port: 8080,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/lib/index.html' }
      ]
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'lib',
      filename: 'index.html',
      template: path.join(appRoot, 'template.html')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  }
}

module.exports = baseConfig