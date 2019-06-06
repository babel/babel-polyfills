export default () => {
  const babelPolyfillPaths = new Set();

  return {
    entryGlobal(meta, utils, path) {
      if (meta.kind === "import" && meta.source === "@babel/polyfill") {
        utils.injectGlobalImport("regenerator-runtime/runtime");
        babelPolyfillPaths.add(path);
      }
    },
    usageGlobal(meta, utils) {
      if (isRegenerator(meta)) {
        utils.injectGlobalImport("regenerator-runtime/runtime");
      }
    },
    usagePure(meta, utils, path) {
      if (!isRegenerator(meta)) return;
      const id = utils.injectDefaultImport("regenerator-runtime");
      path.replaceWith(id);
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
