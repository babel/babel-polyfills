module.exports = {
  plugins: [
    [require("@@/babel-plugin-polyfill-es-shims"), { method: "usage-global" }],
  ],
};
