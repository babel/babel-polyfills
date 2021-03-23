"use strict";

module.exports = function(api) {
  const env = api.env();

  return {
    sourceType: "unambiguous",
    targets: { node: env === "production" ? "6.9" : "current" },
    presets: [["@babel/preset-env", { loose: true }], "@babel/preset-flow"],
  };
};
