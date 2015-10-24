var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    library: "aluminium",
    libraryTarget: "umd",
    path: "./build",
    filename: "index.js"
  },

  postcss: function () {
    return [autoprefixer];
  },

  externals: ['react', 'underscore'],

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname),
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }, {
        test: /\.scss$/,
        // Extract into styles.css file example: https://github.com/css-modules/webpack-demo/blob/master/webpack.config.js
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
          'sass',
          'postcss'
        ]
      }
    ]
  }
}
