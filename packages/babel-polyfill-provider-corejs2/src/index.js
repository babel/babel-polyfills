// @flow

import corejs2Polyfills from "../data/corejs2-built-ins.json";
import {
  BuiltIns,
  StaticProperties,
  InstanceProperties,
} from "./built-in-definitions";
import getPlatformSpecificDefaultFor from "./get-platform-specific-default";
import { hasMinVersion } from "./helpers";

import type { PolyfillProvider } from "@babel/plugin-inject-polyfills";
import { types as t } from "@babel/core";

// $FlowIgnore
const has = Function.call.bind(Object.hasOwnProperty);

type Options = {
  version?: number | string,
  include?: string[],
  exclude?: string[],
};

export default ((
  { getUtils, method, targets, filterPolyfills },
  { version: runtimeVersion = "7.0.0-beta.0" },
) => {
  const polyfills = filterPolyfills(
    corejs2Polyfills,
    getPlatformSpecificDefaultFor(targets),
  );

  function inject(desc, utils) {
    if (typeof desc === "string") {
      if (polyfills.has(desc)) {
        utils.injectGlobalImport(`core-js/modules/${desc}`);
      }
      return;
    }

    desc.global.forEach(name => {
      if (polyfills.has(name)) {
        utils.injectGlobalImport(`core-js/modules/${name}`);
      }
    });
  }

  function maybeInjectPure(desc, name, utils) {
    if (!desc.pure) return;
    if (
      desc.meta &&
      desc.meta.minRuntimeVersion &&
      !hasMinVersion(desc.meta.minRuntimeVersion, runtimeVersion)
    ) {
      return;
    }
    if (polyfills.has(desc.name)) {
      return utils.injectDefaultImport(
        `@babel/runtime-corejs2/core-js/${desc.pure}`,
        name,
      );
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

    usagePure(meta, utils, path) {
      if (meta.kind === "global" && has(BuiltIns, meta.name)) {
        const id = maybeInjectPure(BuiltIns[meta.name], meta.name, utils);
        if (id) path.replaceWith(id);
      }
      if (meta.kind === "property") {
        // We can't compile destructuring.
        if (!path.isMemberExpression()) return;
        if (!path.isReferenced()) return;

        const { placement, object, key } = meta;
        const isCall = path.parentPath.isCallExpression({ callee: path.node });

        if (
          isCall &&
          key === "Symbol.iterator" &&
          path.parent.arguments.length === 0 &&
          polyfills.has("es6.symbol")
        ) {
          path.parentPath.replaceWith(
            t.callExpression(
              utils.injectDefaultImport(
                `@babel/runtime-corejs2/core-js/get-iterator`,
                "getIterator",
              ),
              [path.node.object],
            ),
          );
          path.skip();

          return;
        }

        if (placement === "static") {
          if (has(StaticProperties, object)) {
            const BuiltInProperties = StaticProperties[object];
            if (has(BuiltInProperties, key)) {
              const id = maybeInjectPure(
                BuiltInProperties[key],
                `${object}$${key}`,
                utils,
              );
              if (id) path.replaceWith(id);
            }
          }
        }

        return;
      }

      if (meta.kind === "in") {
        if (meta.key === "Symbol.iterator") {
          path.replaceWith(
            t.callExpression(
              utils.injectDefaultImport(
                `@babel/runtime-corejs2/core-js/is-iterable`,
                "isIterable",
              ),
              [path.node.right],
            ),
          );
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
}: PolyfillProvider<Options>);
