
const path = require('path')
const webpack = require('webpack')
const appRoot = require('app-root-path').path
const { getMode } = require('./util')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = {
  mode: getMode(process.env.NODE_ENV),
  entry: {
    app: path.join(appRoot, 'index.js'),
    story: path.join(appRoot, '/stories/index.js')
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
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: path.join(appRoot, '.eslintrc')
        }
      }
    }),
    new HtmlWebpackPlugin({
      title: 'lib',
      filename: 'index.html',
      template: path.join(appRoot, 'template.html'),
      chunks: ['app']
    }),
    new HtmlWebpackPlugin({
      title: 'story',
      filename: 'story.html',
      template: path.join(appRoot, 'template.html'),
      chunks: ['app', 'story']
    })
  ],
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js'],
    alias: {
      '@common': path.join(appRoot, 'common'),
      '@': path.join(appRoot, 'lib'),
      '@stories': path.join(appRoot, 'stories')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        exclude: [
          path.join(appRoot, 'node_modules')
        ],
        loader: 'eslint-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['transform-class-properties']
          }
        }
      }, {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
          // options: { importLoaders: 1 }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer')()
            ]
          }
        }, {
          loader: 'less-loader'
        }]
      }, {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer')()
            ]
          }
        }]
      }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  }
}

module.exports = baseConfig
