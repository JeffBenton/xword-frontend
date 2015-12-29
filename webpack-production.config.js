var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: [
        "babel-polyfill",
        "/src/entry.js"
    ],
    output: {
        path: __dirname + "/static",
        filename: "/bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader",
                query:
                {
                    plugins: ['transform-runtime'],
                    presets:[ 'react', 'es2015', 'stage-0' ]
                }
            }
        ]
    }
}
