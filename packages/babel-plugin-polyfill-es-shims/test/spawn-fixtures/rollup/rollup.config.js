import babel from "rollup-plugin-babel";

export default {
  input: "src/main.js",
  output: [
    {
      file: "output.js",
      format: "esm",
    },
  ],
  plugins: [
    babel({
      plugins: [
        [
          "@@/polyfill-es-shims",
          { method: "usage-global", missingDependencies: { all: true } },
        ],
      ],
    }),
  ],
};
