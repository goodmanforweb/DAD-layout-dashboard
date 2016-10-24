
//Initialization
const webpack = require('webpack');

//postcss plugins
const postcssConfig = require('./postcss');

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

//  if (env === 'build') {
//   outputFile = appName + '.min.js';
//   // plugins.push(new UglifyJsPlugin({ minimize: true }));
// } else if (env === 'dev') {
//   var chromeBrowser = (os.type() === 'Linux' ? 'chromium-browser' : 'google chrome');
//   outputFile = appName + '.js';
//   plugins.push(
//     // browse to http://localhost:3001 during development
//     new BrowserSyncPlugin(
//       {
//         host: host,
//         port: 3001,
//         server: contentBase
//         // browser: chromeBrowser
//       },
//       {
//         reload: true
//       }
//     )
//   );
// }
module.exports = {
 // Source maps used for debugging information
    devtool: 'eval-source-map',
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    entry: {
        index : SRC,
        common :['react','react-dom','react-router','react-redux','redux']
    },
    output: {
        path: BUILD,
         // publicPath: '/',
        filename: '/js/[hash:8].[name].js'      
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
            },
            {
                test: /\.ts$/,
                exclude: /(public|node_modules)/,
                loader: 'typescript-simple',
                query: {
                    'ignoreWarnings': [
                        2300, // 2300 -> Duplicate identifier
                        2309, // 2309 -> An export assignment cannot be used in a module with other exported elements.
                        2346, // 2346 -> Supplied parameters do not match any signature of call target.
                        2432  // 2432 -> In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.
                    ]
                }
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
            filename: '[hash:8].index.html',
            inject:true,
            hash:false
        }),
        new webpack.BannerPlugin('This file is created by Fine'),
        new ExtractTextPlugin("/css/[hash:8].styles.css")
       ]
};
