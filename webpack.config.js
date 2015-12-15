var webpack = require('webpack');

module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname + "/static",
        filename: "bundle.js"
    },
    plugins: [
      new webpack.ProvidePlugin({
        'Promise': 'es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
};
