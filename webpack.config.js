const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCss = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimiztion = () => {
  const config = {};
  if (isProd) {
    config.minimizer = [new TerserWebpackPlugin(), new CssMinimizerPlugin()];
  }
  return config;
};

const cssLoaders = (addition) => {
  const loader = [
    {
      loader: MiniCss.loader,
    },
    "css-loader",
  ];

  if (addition) {
    loader.push(addition);
  }

  return loader;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: ["@babel/polyfill", "./js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "2048.js",
  },
  resolve: {
    extensions: [".js"],
  },
  optimization: optimiztion(),
  devServer: {
    port: 3000,
    hot: isDev,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCss({
      filename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.(img|png|svg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
