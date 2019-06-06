export default () => {
  const babelPolyfillPaths = new Set();

  return {
    entryGlobal(meta, utils, path) {
      if (meta.kind === "import" && meta.source === "@babel/polyfill") {
        utils.injectGlobalImport("regenerator-runtime/runtime");

        // We can't remove this now because it is also used as an entry
        // point by the core-js polyfill. We will remove it on Program:exit.
        babelPolyfillPaths.add(path);
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
        exit: () => babelPolyfillPaths.forEach(p => p.remove()),
      },
    },
  };
};

const isRegenerator = meta =>
  meta.kind === "global" && meta.name === "regeneratorRuntime";