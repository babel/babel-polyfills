import defineProvider from "@babel/helper-define-polyfill-provider";
import type { PluginPass } from "@babel/core";

const runtimeCompat = "#__secret_key__@babel/runtime__compatibility";

type Options = {
  "#__secret_key__@babel/runtime__compatibility": void | {
    useBabelRuntime: boolean;
    moduleName: string;
  };
};

export default defineProvider<Options>(({ debug, targets, babel }, options) => {
  if (!shallowEqual(targets, babel.targets())) {
    throw new Error(
      "This plugin does not use the targets option. Only preset-env's targets" +
        " or top-level targets need to be configured for this plugin to work." +
        " See https://github.com/babel/babel-polyfills/issues/36 for more" +
        " details.",
    );
  }

  const {
    [runtimeCompat]: { moduleName = null, useBabelRuntime = false } = {},
  } = options;

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
        let pureName = "regenerator-runtime";
        if (useBabelRuntime) {
          const runtimeName =
            moduleName ??
            ((path.hub as any).file as PluginPass).get(
              "runtimeHelpersModuleName",
            ) ??
            "@babel/runtime";
          pureName = `${runtimeName}/regenerator`;
        }

        path.replaceWith(
          utils.injectDefaultImport(pureName, "regenerator-runtime"),
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
