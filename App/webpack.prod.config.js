var webpack = require('webpack')
var path = require('path')
var baseConfig = require('./webpack.base.config')

//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

baseConfig.entry = [
		path.join(__dirname, 'client/main.js'),
	]

baseConfig.plugins = [
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
    new LodashModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
            screw_ie8: true,
            keep_fnames: true
        },
        compress: {
            screw_ie8: true,
            drop_debugger: false
        },
        comments: false
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
		// new webpack.optimize.CommonsChunkPlugin('common.js'),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimize.AggressiveMergingPlugin()
    //new BundleAnalyzerPlugin()
]

module.exports = baseConfig
