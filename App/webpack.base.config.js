const path = require('path');
const webpack = require('webpack');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: './client/index.html',
	filename: 'index.html',
	inject: 'body'
})

module.exports = {
	entry: [
		path.join(__dirname, 'client/main.js'),
		'webpack-hot-middleware/client'
	],
	output: {
		path: path.resolve('dist'),
		filename: 'index_bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=public/fonts/[name].[ext]'
            },
			{test: /\.(jpe?g|png|gif|svg)$/i, /*loaders: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false']*/

		use: [
    {
      loader: 'file-loader',
      options: {
        query: {
          name:'assets/[name].[ext]'
        }
      }
    },
    {
      loader: 'image-webpack-loader',
      options: {
        query: {
          mozjpeg: {
            progressive: true,
          },
          gifsicle: {
            interlaced: true,
          },
          optipng: {
            optimizationLevel: 7,
          }
        }
      }
    }]
},
			{test: /\.json$/, use: 'json-loader', exclude: /node_modules/},
			{test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
			{test: /\.jsx$/, use: 'babel-loader', exclude: /node_modules/},
			{test: /\.css$/, use: 'style-loader', exclude: /node_modules/},
			{test: /\.css$/, loader: 'css-loader', query: {modules: true, localIdentName: '[name]__[local]___[hash:base64:5]'}}
		]
	},
	plugins: [
		HtmlWebpackPluginConfig,
		new webpack.HotModuleReplacementPlugin(),
		new FaviconsWebpackPlugin('./client/img/Hur.png')
	],
	resolve: {
		extensions: ['.js', '.jsx','.css', '.png', '.jpg']
	},
	devtool: 'source-map',
	node: {
		fs: "empty"
	}
}
