import defineProvider from "@babel/helper-define-polyfill-provider";

export default defineProvider(({ debug, targets, babel }) => {
  if (!shallowEqual(targets, babel.targets())) {
    throw new Error(
      "This plugin does not use the targets option. Only preset-env's targets" +
        " or top-level targets need to be configured for this plugin to work." +
        " See https://github.com/babel/babel-polyfills/issues/36 for more" +
        " details.",
    );
  }

  return {
    name: "regenerator",

    polyfills: ["regenerator-runtime"],

    usageGlobal(meta, utils): undefined {
      if (isRegenerator(meta)) {
        debug("regenerator-runtime");
        utils.injectGlobalImport("regenerator-runtime/runtime.js");
      }
    },
    usagePure(meta, utils, path) {
      if (isRegenerator(meta)) {
        path.replaceWith(
          utils.injectDefaultImport(
            "regenerator-runtime",
            "regenerator-runtime",
          ),
        );
      }
    },
  };
});

const isRegenerator = meta =>
  meta.kind === "global" && meta.name === "regeneratorRuntime";

function shallowEqual(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
