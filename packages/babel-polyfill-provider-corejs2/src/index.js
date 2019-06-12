// @flow

import corejs2Polyfills from "../data/corejs2-built-ins.json";
import {
  BuiltIns,
  StaticProperties,
  InstanceProperties,
} from "./built-in-definitions";
import getPlatformSpecificDefaultFor from "./get-platform-specific-default";

import type { PolyfillProvider } from "@babel/plugin-inject-polyfills";

// $FlowIgnore
const has = Function.call.bind(Object.hasOwnProperty);

export default (({ getUtils, method, targets, filterPolyfills }) => {
  const polyfills = filterPolyfills(
    corejs2Polyfills,
    getPlatformSpecificDefaultFor(targets),
  );

  function inject(name, utils) {
    if (typeof name === "string") {
      if (polyfills.has(name)) {
        utils.injectGlobalImport(`core-js/modules/${name}`);
      }
    } else {
      name.forEach(n => inject(n, utils));
    }
  }

  const babelPolyfillPaths = new Set();

  return {
    name: "corejs2",

    entryGlobal(meta, utils, path) {
      if (
        meta.kind === "import" &&
        (meta.source === "@babel/polyfill" || meta.source === "core-js")
      ) {
        for (const name of polyfills) {
          utils.injectGlobalImport(`core-js/modules/${name}`);
        }

        // We can't remove this now because it is also used as an entry
        // point by the core-js polyfill. We will remove it on Program:exit.
        babelPolyfillPaths.add(path);
      }
    },

    usageGlobal(meta, utils) {
      if (meta.kind === "in" && meta.key === "Symbol.iterator") {
        inject("web.dom.iterable", utils);
      } else if (meta.kind === "global") {
        if (!has(BuiltIns, meta.name)) return;

        inject(BuiltIns[meta.name], utils);
      } else if (meta.kind === "property") {
        if (meta.placement === "static" && has(StaticProperties, meta.object)) {
          const BuiltInProperties = StaticProperties[meta.object];
          if (has(BuiltInProperties, meta.key)) {
            inject(BuiltInProperties[meta.key], utils);
          }
        } else if (has(InstanceProperties, meta.key)) {
          let InstancePropertyDependencies = InstanceProperties[meta.key];
          if (meta.object && meta.placement === "instance") {
            const low = meta.object.toLowerCase();
            InstancePropertyDependencies = InstancePropertyDependencies.filter(
              module => module.includes(low),
            );
          }
          inject(InstancePropertyDependencies, utils);
        }
      }
    },

    visitor: {
      Program: {
        exit: () => babelPolyfillPaths.forEach(p => p.node && p.remove()),
      },

      // $FlowIgnore
      ...(method === "usage-global" && {
        // yield*
        YieldExpression(path) {
          if (path.node.delegate) {
            inject("web.dom.iterable", getUtils(path));
          }
        },
      }),
    },
  };
}: PolyfillProvider<>);
