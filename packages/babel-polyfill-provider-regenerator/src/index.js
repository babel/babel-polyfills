// @flow

import type { PolyfillProvider } from "@babel/plugin-inject-polyfills";

export default (() => {
  return {
    name: "regenerator",

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
  };
}: PolyfillProvider<>);

const isRegenerator = meta =>
  meta.kind === "global" && meta.name === "regeneratorRuntime";
