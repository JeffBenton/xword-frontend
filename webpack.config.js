var webpack = require('webpack');

module.exports = {
    entry: [
        "babel-polyfill",
        "./src/entry.js"
        ],
    output: {
        path: __dirname + "/static",
        filename: "bundle.js"
    },
    plugins: [
      new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    },
    devServer: {
        port: 8079,
        historyApiFallback: {
            rewrites: [{
                from: /bundle.js$/,
                to: function(context) {
                    return "/bundle.js";
                }
            },
            {
                from: /\/css\//,
                to: function(context) {
                    var url = context.parsedUrl.href;
                    return url.substring(url.indexOf("/css/"), url.length);
                }
            }]
        }
    }
};
