const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  // devtool: "inline-source-map",
  context: path.join(__dirname, "/client"),
  entry: "./index.jsx",
  output: {
    path: path.join(__dirname, "/public"),
    filename: '[name].js',
    publicPath: "/public",
  },
  mode: "development",
  // watch: true, //Bundle on saved changes
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react", "stage-2"],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: module => /node_modules/.test(module.resource),
          enforce: true,
        },
      },
    },
    minimizer: [new UglifyJsPlugin()],
  },
};
