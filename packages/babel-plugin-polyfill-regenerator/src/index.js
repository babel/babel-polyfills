// @flow

import defineProvider from "@babel/helper-define-polyfill-provider";

export default defineProvider(({ debug }) => {
  return {
    name: "regenerator",

    polyfills: ["regenerator-runtime"],

    usageGlobal(meta, utils) {
      if (isRegenerator(meta)) {
        debug("regenerator-runtime");
        utils.injectGlobalImport("regenerator-runtime/runtime.js");
      }
    },
    usagePure(meta, utils, path) {
      if (isRegenerator(meta)) {
        path.replaceWith(utils.injectDefaultImport("regenerator-runtime"));
      }
    },
  };
});

const isRegenerator = meta =>
  meta.kind === "global" && meta.name === "regeneratorRuntime";
