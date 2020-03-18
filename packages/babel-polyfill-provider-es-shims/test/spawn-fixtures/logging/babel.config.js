module.exports = {
  plugins: [
    [require("@babel/plugin-inject-polyfills"), {
      method: "usage-global",
      providers: [
        [require("../../..")]
      ]
    }]
  ]
};
