module.exports = {
  plugins: [
    [
      require("../../helpers/generic-provider.js"),
      {
        method: "usage-global",
        globals: {
          a: "___a___not_a_real_pkg___",
          b: "___b___not_a_real_pkg___",
          c: "___c___not_a_real_pkg___",
        },
        missingDependencies: { all: true },
      },
    ],
  ],
};
