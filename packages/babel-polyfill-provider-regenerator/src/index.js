import support from "../data/generators.json";

export default ({ isPolyfillRequired }) => {
  const babelPolyfillPaths = new Set();

  const required = isPolyfillRequired(support);

  return {
    entryGlobal(meta, utils, path) {
      if (meta.kind !== "import") return;
      if (meta.source === "@babel/polyfill") {
        if (required) utils.injectGlobalImport("regenerator-runtime/runtime");

        // We can't remove this now because it is also used as an entry
        // point by the core-js polyfill. We will remove it on Program:exit.
        babelPolyfillPaths.add(path);
      } else if (meta.source === "regenerator-runtime/runtime") {
        if (!required) path.remove();
      }
    },
    usageGlobal(meta, utils) {
      if (isRegenerator(meta)) {
        utils.injectGlobalImport("regenerator-runtime/runtime");
      }
    },
    usagePure(meta, utils, path) {
      if (isRegenerator(meta)) {
        path.replaceWith(utils.injectDefaultImport("regenerator-runtime"));
      }
    },
    visitor: {
      Program: {
        exit: () => babelPolyfillPaths.forEach(p => p.node && p.remove()),
      },
    },
  };
};

const isRegenerator = meta =>
  meta.kind === "global" && meta.name === "regeneratorRuntime";
