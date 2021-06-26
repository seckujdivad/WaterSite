const path = require("path");

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
				test: /\.css$/,
				include: path.resolve(__dirname, "src"),
				use: [
					"style-loader",
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
				test: /\.ts$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]
						}
					},
					"ts-loader"
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
					"ts-loader"
				]
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, "public")
	},
	devtool: "source-map",
	resolve: {
		extensions: ['', '.js', '.jsx', '.ts', '.tsx']
	}
};