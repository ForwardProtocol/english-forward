const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
    mode: "production",
    entry: './src/index.js',
    // devtool: '', // Removed dev-tools mapping
    output: {
        path: __dirname + '/build/static',
        publicPath: 'static/',
        filename: '[name].js',
        chunkFilename: "[name].chunk.js",
    },
    resolve: {
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', '.less'],
    },
    module: {
    	rules: [
    	{
                test: /\.(js)$/,
                // exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            ["@babel/env", {
                                "targets": {
                                    'browsers': ['Chrome >=59']
                                },
                                "modules": false,
                                "loose": true
                            }], "@babel/react"],

                        plugins: [
                            "react-hot-loader/babel",
                            "@babel/proposal-object-rest-spread",
                            "@babel/plugin-proposal-class-properties",
                        ]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                ]
            },
            {
		        test: /\.s[ac]ss$/i,
		        use: [
		          "style-loader",
		          "css-loader",
		          "sass-loader",
		        ],
	      	},
    		{ test: /\.txt$/, use: 'raw-loader' },
    		{
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                // test: /\.(woff(2)?|ttf|eot|svg)(\?[a-z0-9]+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // publicPath: "../fonts/",
                            //name: "../fonts/[name].[ext]",
                            // limit: 10000,
                            // outputPath: './fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        name: '[name].[ext]',
                    },
                }
            }
    	],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false
        }
    },
    plugins: [
    	new HtmlWebpackPlugin({ 
		 	template: './public/index.html',
            filename: '../index.html',
    	 }),
        new CompressionPlugin({
	      // filename: "[path].gz[query]",
	      //algorithm: "gzip",
	      //test: /\.(js|css)$/i,
	      	algorithm: "gzip",
        	test: /\.js$|\.css$|\.html$/,
	        threshold: 10240,
	        minRatio: 0.8
	    }),
	    new webpack.ProvidePlugin({
      		"React": "react",
   		}),
    ],
}