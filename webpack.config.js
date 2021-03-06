
//Initialization
const webpack = require('webpack');

//postcss plugins
const postcssConfig = require('./postcss');

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
// const D3 = path.join(__dirname, 'src/js/public/d3.js');
// const PROTOVIS  = path.join(__dirname, 'src/js/public/protovis.js');
// const PVC = path.join(__dirname, 'src/js/public/pvc.js');
const PUBLIC = path.join(__dirname, 'src/public');

module.exports = {
    entry: {
        index : SRC
    },
    output: {
        path: BUILD,
         // publicPath: '/',
        filename: './js/[name].[hash:8].min.js'      
    },
    resolve: { 
        extensions: ['', '.js', '.jsx', '.scss', '.css'] 
    },
    module: {
        noParse: /node_modules\/json-schema\/lib\/validate\.js/,
        loaders: [
            {
              test: /\.(es6|js)$/,
              exclude: /(public|node_modules)/,
              loaders: ['babel-loader']
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
            {test: /\.(png|jpg|svg)$/, loader: "url-loader?limit=8192&name=/images/[hash:8].[name].[ext]"},
            {test: /\.(ttf|woff|eot)$/, loader: "url-loader?limit=8192&name=/fonts/[hash:8].[name].[ext]"},
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
        new webpack.optimize.CommonsChunkPlugin('common','./js/common.[hash:8].min.js'),
        new CopyWebpackPlugin([
          { from: PUBLIC, to: BUILD+'./js' }
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
        new ExtractTextPlugin("./css/[hash:8].styles.css")
       ]
};
