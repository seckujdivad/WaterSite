const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
	entry: "./src/index.tsx",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true
	},
	module: {
		rules: [
			{
				test: /(?<!module)\.css$/,
				include: path.resolve(__dirname, "src"),
				use: [
					"style-loader",
					"css-loader"
				]
			},
			{
				test: /\.module\.css$/,
				include: path.resolve(__dirname, "src"),
				use: [
					"style-loader",
					"@teamsupercell/typings-for-css-modules-loader",
					"css-loader"
				]
			},
			{
				test: /\.js$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]
						}
					}
				]
			},
			{
				test: /\.jsx$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-react"]
						}
					}
				]
			},
			{
				test: /(?<!\.d)\.ts$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]
						}
					},
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true
						}
					}
				]
			},
			{
				test: /\.tsx$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-react"]
						}
					},
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true
						}
					}
				]
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, "public")
	},
	devtool: "source-map",
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	plugins: [new ForkTsCheckerWebpackPlugin()]
};