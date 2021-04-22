const path = require("path");

module.exports = {
	entry: "./src/index.jsx",
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
				use: "css-loader"
			},
			{
				test: /\.jsx?$/,
				include: path.resolve(__dirname, "src"),
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react"]
					}
				}
			}
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, "public")
	}
};