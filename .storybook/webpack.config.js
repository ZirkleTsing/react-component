const path = require('path')
const appRoot = require('app-root-path').path

module.exports = (storybookBaseConfig, configType) => {
  storybookBaseConfig.resolve.alias = {
    ...storybookBaseConfig.resolve.alias,
    '@common': path.join(appRoot, 'common'),
    '@': path.join(appRoot, 'lib')
  }
  storybookBaseConfig.module.rules.push({
    test: /\.less$/,
    use: [{
      loader: 'style-loader'
    }, {
      loader: 'css-loader'
    }, {
      loader: 'postcss-loader',
      options: {
        plugins: [
          require('autoprefixer')()
        ]}
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
      ]}
    }]
  }, {
    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
    loader: 'url-loader',
    options: {
      limit: 10000
    }
  });

  // Return the altered config
  return storybookBaseConfig;
};
