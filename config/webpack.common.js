var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// dynamically pastes a script tag in our index.html file
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// takes all our css and moves it to a different bundle
// so that we can load the bundles (js and css) parallely
var helpers = require('./helpers');

module.exports = {
    entry: {
        polyfills: './src/polyfill',
        vendor: './src/vendor',
        app: './src/main'
    },
    resolve: {
        extensions:['.ts','.js']
    },
    module: {
        rules:[{
            test: /\.ts$/,
            loader:[
                {
                    loader: 'babel-loader'
                },
                {
                    loader:'awesome-typescript-loader',
                    options: {
                        configFileName: helpers.root('tsconfig.json')
                    }
                },
                {
                  loader: 'angular-2-template-loader'
                }
            ],
            exclude: [/node_modules/]
        }, {
            test: /\.js$/,
            loader: [
                {
                    loader: 'babel-loader'
                }
            ],
            exclude: [/node_modules/],
            query: {
                presets: ['es2015']
            }
        }, {
                test: /\.html$/,
                loader:[
                    {
                        loader: 'babel-loader'
                    }
                ]
        },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                use: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    use: 'css-loader?sourceMap'
                })
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        ),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfill']
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};

/*
 angular-2-template-loader is used to inline the angular-2 templates
 which helps in aot
 awesome-typescript loader <> ts->es2015
 babel-loader <> es2015-> es5

 query: {
      presets: ['es2015']
 } -> babel-loader with presets es2015 helps to standardize
 and resolve cross-browser-compatibility issues
 */