const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const devBuild = process.env.NODE_ENV !== 'production'

const typescriptLoader = {
	loader: "ts-loader",
	options: {
		transpileOnly: true
	}
};

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
				use: devBuild ?
				[
					typescriptLoader
				]
				:
				[
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]
						}
					},
					typescriptLoader
				]
			},
			{
				test: /\.tsx$/,
				include: path.resolve(__dirname, "src"),
				use: devBuild ?
				[
					typescriptLoader
				]
				:
				[
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-react"]
						}
					},
					typescriptLoader
				]
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, "public")
	},
	devtool: devBuild ? "eval-cheap-module-source-map" : "source-map",
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	plugins: [new ForkTsCheckerWebpackPlugin()]
};