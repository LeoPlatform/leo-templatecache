const path = require("path");
const webpack = require('webpack');

let rootDir = path.resolve('/c/Steve/contracting/younique/starbuck/thrace/src');
let entries = ['App.js'];

var config = [{
	devtool: 'eval-source-map',
	entry: entries,
	output: {
		path: path.join(rootDir, `/dist/`),
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].js',
		publicPath: publicPath //needed for css to reference the images properly
	},
	mode: "production",
	node: {
		fs: "empty"
	},
	resolve: {
		modules: ['node_modules', path.resolve(__dirname, "../node_modules")]
	},
	resolveLoader: {
		modules: ['node_modules', path.resolve(__dirname, "../node_modules")]
	},
	optimization: {
		minimize: true,
		splitChunks: {
			cacheGroups: {
				common: {
					test: /node_modules/,
					name: "common",
					chunks: "initial",
					enforce: true
				}
			}
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	],
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
				}
			}
		}, {
			test: /\.json?$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'json-loader'
			}
		}]
	}
}];
webpack(config, function (err, stats) {
	if (err) {
		console.log(err);
	} else {
		console.log(stats.toString({
			assets: true,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}));
	}
});
