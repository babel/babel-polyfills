"use strict";

module.exports = function(api) {
  const env = api.env();

  return {
    sourceType: "unambiguous",
    presets: [
      [
        "@babel/preset-env",
        {
          loose: true,
          exclude: ["transform-typeof-symbol"],
          targets: { node: env === "production" ? "6.9" : "current" },
        },
      ],
      "@babel/preset-flow",
    ],
  };
};
