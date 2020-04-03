const path = require("path");

module.exports = {
  mode: "development",

  entry: path.join(__dirname, "src/main.js"),
  output: {
    path: __dirname,
    filename: "output.js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          plugins: [
            [
              "@@/polyfill-es-shims",
              { method: "usage-global", missingDependencies: { all: true } },
            ],
          ],
        },
      },
    ],
  },

  devtool: false,
};
