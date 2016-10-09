
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'es5-shim'],
        browsers: ['PhantomJS'],
        reporters: ['dots'],
        files: [
            './src/index.jsx'
        ],
        preprocessors: {
           './src/index.jsx': ['webpack']
        },
        webpack: {
            module: {
                loaders: [{
                    test: /\.(es6|js|jsx)?$/,
                    exclude: /node_modules/,
                    loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015']
                }]
            }
        },
        plugins: [
            require('karma-webpack'),
            require('karma-jasmine'),
            require('karma-es5-shim'),
            require('karma-phantomjs-launcher')
        ],
        webpackServer: {
            noInfo: true
        }
    });
};
