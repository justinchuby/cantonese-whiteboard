var path = require('path');

module.exports = {
    entry: ['./src/app.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            exclude: /node_modules/,
            test: /\.js$/,
            query: {
                presets: ['es2015', 'react', 'stage-0'],
            },
        },
        {
            test: /\.json$/,
            loader: "json"
        }
            ]
    }
};
