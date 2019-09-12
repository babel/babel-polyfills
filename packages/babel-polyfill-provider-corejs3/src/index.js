// @flow

import corejs3Polyfills from "core-js-compat/data";
import corejs3ShippedProposalsList from "./shipped-proposals";
import getModulesListForTargetVersion from "core-js-compat/get-modules-list-for-target-version";
import {
  BuiltIns,
  CommonIterators,
  CommonInstanceDependencies,
  PromiseDependencies,
  StaticProperties,
  InstanceProperties,
  type CoreJSPolyfillDescriptor,
} from "./built-in-definitions";

import { types as t } from "@babel/core";
import { callMethod, coreJSModule, isCoreJSSource } from "./utils";

import { type PolyfillProvider } from "@babel/plugin-inject-polyfills";

type Options = {|
  version?: number | string,
  proposals?: boolean,
  shippedProposals?: boolean,
|};

export default ((
  { getUtils, method, shouldInjectPolyfill, createMetaResolver, debug },
  { version = 3, proposals, shippedProposals },
) => {
  const resolve = createMetaResolver({
    global: BuiltIns,
    static: StaticProperties,
    instance: InstanceProperties,
  });

  const available = new Set(getModulesListForTargetVersion(version));
  const coreJSBase = proposals
    ? "@babel/runtime-corejs3/core-js"
    : "@babel/runtime-corejs3/core-js-stable";

  function maybeInjectGlobal(names: string[], utils) {
    for (const name of names) {
      if (shouldInjectPolyfill(name)) {
        debug(name);
        utils.injectGlobalImport(coreJSModule(name));
      }
    }
  }

  function maybeInjectPure(
    desc: CoreJSPolyfillDescriptor,
    hint,
    utils,
    object,
  ) {
    if (
      desc.pure &&
      !(object && desc.exclude && desc.exclude.includes(object)) &&
      shouldInjectPolyfill(desc.name)
    ) {
      return utils.injectDefaultImport(`${coreJSBase}/${desc.pure}`, hint);
    }
  }

  return {
    name: "corejs3",

    polyfills: corejs3Polyfills,

    filterPolyfills(name) {
      if (!available.has(name)) return false;
      if (proposals || method === "entry-global") return true;
      if (shippedProposals && corejs3ShippedProposalsList.has(name)) {
        return true;
      }
      return !name.startsWith("esnext.");
    },

    entryGlobal(meta, utils, path) {
      if (meta.kind !== "import") return;

      const modules = isCoreJSSource(meta.source);
      if (!modules) return;

      if (
        modules.length === 1 &&
        meta.source === coreJSModule(modules[0]) &&
        shouldInjectPolyfill(modules[0])
      ) {
        // Avoid infinite loop: do not replace imports with a new copy of
        // themselves.
        debug(null);
        return;
      }

      maybeInjectGlobal(modules, utils);
      path.remove();
    },

    usageGlobal(meta, utils) {
      const resolved = resolve(meta);
      if (!resolved) return;

      let deps = resolved.desc.global;

      if (
        resolved.kind !== "global" &&
        meta.object &&
        meta.placement === "prototype"
      ) {
        const low = meta.object.toLowerCase();
        deps = deps.filter(
          m => m.includes(low) || CommonInstanceDependencies.has(m),
        );
      }

      maybeInjectGlobal(deps, utils);
    },

    usagePure(meta, utils, path) {
      if (meta.kind === "in") {
        if (meta.key === "Symbol.iterator") {
          path.replaceWith(
            t.callExpression(
              utils.injectDefaultImport(
                `@babel/runtime-corejs3/core-js/is-iterable`,
                "isIterable",
              ),
              [path.node.right],
            ),
          );
        }
        return;
      }

      let isCall: ?boolean;

      if (meta.kind === "property") {
        // We can't compile destructuring.
        if (!path.isMemberExpression()) return;
        if (!path.isReferenced()) return;

        isCall = path.parentPath.isCallExpression({ callee: path.node });

        if (meta.key === "Symbol.iterator") {
          if (!shouldInjectPolyfill("es.symbol.iterator")) return;

          if (isCall) {
            if (path.parent.arguments.length === 0) {
              path.parentPath.replaceWith(
                t.callExpression(
                  utils.injectDefaultImport(
                    `@babel/runtime-corejs3/core-js/get-iterator`,
                    "getIterator",
                  ),
                  [path.node.object],
                ),
              );
              path.skip();
            } else {
              callMethod(
                path,
                utils.injectDefaultImport(
                  `@babel/runtime-corejs3/core-js/get-iterator-method`,
                  "getIteratorMethod",
                ),
              );
            }
          } else {
            path.replaceWith(
              t.callExpression(
                utils.injectDefaultImport(
                  `@babel/runtime-corejs3/core-js/get-iterator-method`,
                  "getIteratorMethod",
                ),
                [path.node.object],
              ),
            );
          }

          return;
        }
      }

      const resolved = resolve(meta);
      if (!resolved) return;

      if (resolved.kind === "global") {
        const id = maybeInjectPure(resolved.desc, resolved.name, utils);
        if (id) path.replaceWith(id);
      } else if (resolved.kind === "static") {
        const id = maybeInjectPure(
          resolved.desc,
          resolved.name,
          utils,
          // $FlowIgnore
          meta.object,
        );
        if (id) path.replaceWith(id);
      } else if (resolved.kind === "instance") {
        const id = maybeInjectPure(
          resolved.desc,
          `${resolved.name}InstanceProperty`,
          utils,
          // $FlowIgnore
          meta.object,
        );
        if (!id) return;

        if (isCall) {
          callMethod(path, id);
        } else {
          path.replaceWith(t.callExpression(id, [path.node.object]));
        }
      }
    },

    visitor: method === "usage-global" && {
      // import("foo")
      CallExpression(path) {
        if (path.get("callee").isImport()) {
          maybeInjectGlobal(PromiseDependencies, getUtils(path));
        }
      },

      // (async function () { }).finally(...)
      Function(path) {
        if (path.node.async) {
          maybeInjectGlobal(PromiseDependencies, getUtils(path));
        }
      },

      // for-of, [a, b] = c
      "ForOfStatement|ArrayPattern"(path) {
        maybeInjectGlobal(CommonIterators, getUtils(path));
      },

      // [...spread]
      SpreadElement(path) {
        if (!path.parentPath.isObjectExpression()) {
          maybeInjectGlobal(CommonIterators, getUtils(path));
        }
      },

      // yield*
      YieldExpression(path) {
        if (path.node.delegate) {
          maybeInjectGlobal(CommonIterators, getUtils(path));
        }
      },
    },
  };
}: PolyfillProvider<Options>);
