var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: ['./src/app.js', './src/style.scss'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
      },
      }, {
        test: /\.json$/,
        loader: "json"
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      }]
  },
  plugins: [
    new ExtractTextPlugin("style.css", {
        allChunks: true
    })
  ]
};
