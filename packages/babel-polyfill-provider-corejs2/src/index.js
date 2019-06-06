import { types as t } from "@babel/core";

import corejs2Polyfills from "../data/corejs2-built-ins.json";
import {
  BuiltIns,
  StaticProperties,
  InstanceProperties,
} from "./built-in-definitions";

const has = Function.call.bind(Object.hasOwnProperty);

export default ({ getUtils, method }) => {
  const polyfills = corejs2Polyfills;

  return {
    entryGlobal(meta, utils, path) {
      if (
        meta.kind === "import" &&
        (meta.source === "@babel/polyfill" || meta.source === "core-js")
      ) {
        path.remove();

        for (const name of Object.keys(polyfills)) {
          utils.injectGlobalImport(name);
        }
      }
    },

    usageGlobal(meta, utils, path) {
      function inject(name) {
        if (typeof name === "string") {
          utils.injectGlobalImport("core-js/" + name);
        } else {
          name.forEach(name => utils.injectGlobalImport("core-js/" + name));
        }
      }

      if (meta.kind === "in" && meta.key === "Symbol.iterator") {
        utils.injectGlobalImport("core-js/web.dom.iterable");
      } else if (meta.kind === "global") {
        if (t.isMemberExpression(path.parent)) return;
        if (!has(BuiltIns, meta.name)) return;

        inject(BuiltIns[meta.name]);
      } else if (meta.kind === "property") {
        if (meta.placement === "static" && has(StaticProperties, meta.object)) {
          const BuiltInProperties = StaticProperties[meta.object];
          if (has(BuiltInProperties, meta.key)) {
            inject(BuiltInProperties[meta.key]);
          }
        } else if (has(InstanceProperties, meta.key)) {
          let InstancePropertyDependencies = InstanceProperties[meta.key];
          if (meta.object) {
            const low = meta.object.toLowerCase();
            InstancePropertyDependencies = InstancePropertyDependencies.filter(
              module => module.includes(low),
            );
          }
          inject(InstancePropertyDependencies);
        }
      }
    },

    visitor: method === "usage-global" && {
      // yield*
      YieldExpression(path: NodePath) {
        if (path.node.delegate) {
          getUtils(path).injectGlobalImport("core-js/web.dom.iterable");
        }
      },
    },
  };
};
