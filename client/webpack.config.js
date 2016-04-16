var path = require('path')
var webpack = require('webpack')

var SpritesheetPlugin = require('./webpack/SpritesheetPlugin.js')

module.exports = {
  entry: './src/main.js',

  resolve: {
    extensions: [ '', '.js' ],
  },

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    // publicPath: '/public/'
  },

  devServer: {
    contentBase: './public',
  },

  devtool: 'source-map',

  module: {
    loaders: [
      { test: path.join(__dirname, '.'), loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'file-loader' }
    ],

    // allow requiring BRFS
    postLoaders: [
      { include: path.resolve(__dirname, 'node_modules/pixi.js'), loader: 'transform/cacheable?brfs' }
    ]

  },

  plugins: [
    new webpack.ProvidePlugin({
      PIXI: "pixi.js",
      Tweener: "tweener",
      App: __dirname + "/src/core/App",
      // ResourceManager: __dirname + '/client/resource/manager',
      config: __dirname + '/src/config'
    }),

    new SpritesheetPlugin(__dirname + "/images/*.png", {
      format: 'json',
      path: "public",
      powerOfTwo: true,
      padding: 1
    })
  ]

}
