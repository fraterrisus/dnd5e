const path    = require("path")
const webpack = require("webpack")
const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  mode,
  module: {
    rules: [
      {
        test: /\.woff2?$/i,
        use: {
          loader: 'file-loader?mimetype=application/font-woff',
          options: {
            name: "[path][name]-[contenthash].[ext].digested",
          }
        }
      },
    ]
  },
  entry: {
    application: "./app/javascript/application.js",
    caster_classes: "./app/javascript/controllers/caster_classes.js",
    characters: "./app/javascript/controllers/characters.js",
    combat: "./app/javascript/controllers/combat.js",
    dice: "./app/javascript/lib/dice.js",
    spells: "./app/javascript/controllers/spells.js",
  },
  optimization: {
    moduleIds: 'deterministic',
  },
  output: {
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    path: path.resolve(__dirname, "app/assets/builds"),
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
}
