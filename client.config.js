const webpack = require('webpack');
const entry = require('webpack-glob-entry');

const client = {
    entry: entry('./client/**/**/*.js'),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ],
                        plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist/client/'
    }
};

const shared = {
    entry: entry('./shared/**/*.js'),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ],
                        plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist/shared/'
    }
};

const server = {
    entry: entry('./server/**/*.js'),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ],
                        plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ 'global.GENTLY': false })
    ],
    optimization: {
        minimize: false
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist/server/'
    },
    target: "node",
};

module.exports = [server, shared, client];