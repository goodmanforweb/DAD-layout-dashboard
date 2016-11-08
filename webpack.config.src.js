
'use strict';
let postcssConfig = require('./postcss');
//Initialization
const webpack = require('webpack');

// Lint and test
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

//File ops
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Folder ops
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// Constants
const SRC = path.join(__dirname, 'src');
const BUILD = path.join(__dirname, 'build');
const TEMPLATE = path.join(__dirname, 'src/templates/index.html');
const PUBLIC = path.join(__dirname, 'src/public');
const LINT = path.join(__dirname, '.eslintrc.js');
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;
const PROXY = `http://${HOST}:${PORT}`;
 
module.exports = {
 // Source maps used for debugging information
    devtool: 'eval-source-map',
 // webpack-dev-server configuration
    devServer: {
        contentBase:'./build',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: HOST,
        port: PORT,
        outputPath: BUILD, // The path should be an absolute path to your build destination.
        proxy: {
                '/xdatainsight/*': {
                    target: 'http://192.168.0.95:41116',
                    secure: false,
                    auth: 'admin:password'
                }   
            }
    },
    entry: {
        index : SRC
    },
    output: {
        path: BUILD,
        // publicPath: '/',
        filename: '/js/[name].js'      
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss', '.css'] 
    },
    eslint: {
        configFile: LINT,
        emitError: true
      },
    module: {

        preLoaders: [
          {
            test: /\.jsx?$/,
            exclude: /(public|node_modules)/,
            loader: 'eslint-loader'
          }
        ],
        noParse: /node_modules\/json-schema\/lib\/validate\.js/,
        loaders: [
            {
              test: /\.(es6|js)$/,
              exclude: /(public|node_modules)/,
              loaders: ['babel-loader', 'eslint-loader']
            },
            {
                test:/\.jsx?$/,
                loader: 'babel',
                exclude:/(node_modules)/,
                query:{
                    presets:['react','es2015']
                }
            },
            {test:/\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')},
            // inline base64 URLs for <=8k images, direct URLs for the rest
            {test: /\.(png|jpg|ttf|woff|svg|eot)$/, loader: 'url-loader'},
            {
                test: /\.(scss|sass)$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 versions!sass?sourceMap'
            }
        ]
    },
    postcss() {
        return postcssConfig();
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') // eslint-disable-line quote-props
          }
        }),
        new webpack.optimize.CommonsChunkPlugin('common','/js/common.js'),
        new CopyWebpackPlugin([
          { from: PUBLIC, to: BUILD+'/js' }
        ],
          {
            ignore: [
              // Doesn't copy Mac storage system files
              '.DS_Store'
            ]
          }
        ),
        new HtmlwebpackPlugin({
            title: '',
            template:TEMPLATE,
            filename: 'index.html',
            inject:true,
            hash:false
        }),
        new webpack.BannerPlugin('This file is created by Fine'),
        new ExtractTextPlugin("/css/styles.css")
       ]
};
