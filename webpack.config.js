module.exports = {
    entry: "./src/app.js",
    output: {
        path: __dirname + "/static",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
};
