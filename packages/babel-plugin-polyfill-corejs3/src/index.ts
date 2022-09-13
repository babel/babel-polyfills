import corejs3Polyfills from "../core-js-compat/data.js";
import corejs3ShippedProposalsList from "./shipped-proposals";
import getModulesListForTargetVersion from "../core-js-compat/get-modules-list-for-target-version.js";
import {
  BuiltIns,
  CommonIterators,
  CommonInstanceDependencies,
  PromiseDependencies,
  PromiseDependenciesWithIterators,
  StaticProperties,
  InstanceProperties,
  type CoreJSPolyfillDescriptor,
} from "./built-in-definitions";
import canSkipPolyfill from "./usage-filters";

import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";
import {
  callMethod,
  coreJSModule,
  isCoreJSSource,
  coreJSPureHelper,
} from "./utils";

import defineProvider from "@babel/helper-define-polyfill-provider";

const runtimeCompat = "#__secret_key__@babel/runtime__compatibility";

type Options = {
  version?: number | string;
  proposals?: boolean;
  shippedProposals?: boolean;
  "#__secret_key__@babel/runtime__compatibility": void | {
    useBabelRuntime: string;
    ext: string;
  };
};

const esnextFallback = (
  name: string,
  cb: (name: string) => boolean,
): boolean => {
  if (cb(name)) return true;
  if (!name.startsWith("es.")) return false;
  const fallback = `esnext.${name.slice(3)}`;
  if (!corejs3Polyfills[fallback]) return false;
  return cb(fallback);
};

export default defineProvider<Options>(function (
  { getUtils, method, shouldInjectPolyfill, createMetaResolver, debug, babel },
  {
    version = 3,
    proposals,
    shippedProposals,
    [runtimeCompat]: { useBabelRuntime, ext = ".js" } = { useBabelRuntime: "" },
  },
) {
  const isWebpack = babel.caller(caller => caller?.name === "babel-loader");

  const resolve = createMetaResolver({
    global: BuiltIns,
    static: StaticProperties,
    instance: InstanceProperties,
  });

  const available = new Set(getModulesListForTargetVersion(version));

  function getCoreJSPureBase(useProposalBase) {
    return useBabelRuntime
      ? useProposalBase
        ? `${useBabelRuntime}/core-js`
        : `${useBabelRuntime}/core-js-stable`
      : useProposalBase
      ? "core-js-pure/features"
      : "core-js-pure/stable";
  }

  function maybeInjectGlobalImpl(name: string, utils) {
    if (shouldInjectPolyfill(name)) {
      debug(name);
      utils.injectGlobalImport(coreJSModule(name));
      return true;
    }
    return false;
  }

  function maybeInjectGlobal(names: string[], utils, fallback = true) {
    for (const name of names) {
      if (fallback) {
        esnextFallback(name, name => maybeInjectGlobalImpl(name, utils));
      } else {
        maybeInjectGlobalImpl(name, utils);
      }
    }
  }

  function maybeInjectPure(
    desc: CoreJSPolyfillDescriptor,
    hint,
    utils,
    object?,
  ) {
    if (
      desc.pure &&
      !(object && desc.exclude && desc.exclude.includes(object)) &&
      esnextFallback(desc.name, shouldInjectPolyfill)
    ) {
      const { name } = desc;
      let useProposalBase = false;
      if (proposals || (shippedProposals && name.startsWith("esnext."))) {
        useProposalBase = true;
      } else if (name.startsWith("es.") && !available.has(name)) {
        useProposalBase = true;
      }
      const coreJSPureBase = getCoreJSPureBase(useProposalBase);
      return utils.injectDefaultImport(
        `${coreJSPureBase}/${desc.pure}${ext}`,
        hint,
      );
    }
  }

  function isFeatureStable(name) {
    if (name.startsWith("esnext.")) {
      const esName = `es.${name.slice(7)}`;
      // If its imaginative esName is not in latest compat data, it means
      // the proposal is not stage 4
      return esName in corejs3Polyfills;
    }
    return true;
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
      return isFeatureStable(name);
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

      const modulesSet = new Set(modules);
      const filteredModules = modules.filter(module => {
        if (!module.startsWith("esnext.")) return true;
        const stable = module.replace("esnext.", "es.");
        if (modulesSet.has(stable) && shouldInjectPolyfill(stable)) {
          return false;
        }
        return true;
      });

      maybeInjectGlobal(filteredModules, utils, false);
      path.remove();
    },

    usageGlobal(meta, utils, path) {
      const resolved = resolve(meta);
      if (!resolved) return;

      if (canSkipPolyfill(resolved.desc, path)) return;

      let deps = resolved.desc.global;

      if (
        resolved.kind !== "global" &&
        "object" in meta &&
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
                coreJSPureHelper("is-iterable", useBabelRuntime, ext),
                "isIterable",
              ),
              [(path.node as t.BinaryExpression).right], // meta.kind === "in" narrows this
            ),
          );
        }
        return;
      }

      if (path.parentPath.isUnaryExpression({ operator: "delete" })) return;

      if (meta.kind === "property") {
        // We can't compile destructuring and updateExpression.
        if (!path.isMemberExpression()) return;
        if (!path.isReferenced()) return;
        if (path.parentPath.isUpdateExpression()) return;
        if (t.isSuper(path.node.object)) {
          return;
        }

        if (meta.key === "Symbol.iterator") {
          if (!shouldInjectPolyfill("es.symbol.iterator")) return;

          const { parent, node } = path;
          if (t.isCallExpression(parent, { callee: node })) {
            if (parent.arguments.length === 0) {
              path.parentPath.replaceWith(
                t.callExpression(
                  utils.injectDefaultImport(
                    coreJSPureHelper("get-iterator", useBabelRuntime, ext),
                    "getIterator",
                  ),
                  [node.object],
                ),
              );
              path.skip();
            } else {
              callMethod(
                path,
                utils.injectDefaultImport(
                  coreJSPureHelper("get-iterator-method", useBabelRuntime, ext),
                  "getIteratorMethod",
                ),
              );
            }
          } else {
            path.replaceWith(
              t.callExpression(
                utils.injectDefaultImport(
                  coreJSPureHelper("get-iterator-method", useBabelRuntime, ext),
                  "getIteratorMethod",
                ),
                [path.node.object],
              ),
            );
          }

          return;
        }
      }

      let resolved = resolve(meta);
      if (!resolved) return;

      if (canSkipPolyfill(resolved.desc, path)) return;

      if (
        useBabelRuntime &&
        resolved.desc.pure &&
        resolved.desc.pure.slice(-6) === "/index"
      ) {
        // Remove /index, since it doesn't exist in @babel/runtime-corejs3s
        resolved = {
          ...resolved,
          desc: {
            ...resolved.desc,
            pure: resolved.desc.pure.slice(0, -6),
          },
        };
      }

      if (resolved.kind === "global") {
        const id = maybeInjectPure(resolved.desc, resolved.name, utils);
        if (id) path.replaceWith(id);
      } else if (resolved.kind === "static") {
        const id = maybeInjectPure(
          resolved.desc,
          resolved.name,
          utils,
          // @ts-expect-error
          meta.object,
        );
        if (id) path.replaceWith(id);
      } else if (resolved.kind === "instance") {
        const id = maybeInjectPure(
          resolved.desc,
          `${resolved.name}InstanceProperty`,
          utils,
          // @ts-expect-error
          meta.object,
        );
        if (!id) return;

        const { node } = path as NodePath<t.MemberExpression>;
        if (t.isCallExpression(path.parent, { callee: node })) {
          callMethod(path, id);
        } else {
          path.replaceWith(t.callExpression(id, [node.object]));
        }
      }
    },

    visitor: method === "usage-global" && {
      // import("foo")
      CallExpression(path: NodePath<t.CallExpression>) {
        if (path.get("callee").isImport()) {
          const utils = getUtils(path);

          if (isWebpack) {
            // Webpack uses Promise.all to handle dynamic import.
            maybeInjectGlobal(PromiseDependenciesWithIterators, utils);
          } else {
            maybeInjectGlobal(PromiseDependencies, utils);
          }
        }
      },

      // (async function () { }).finally(...)
      Function(path: NodePath<t.Function>) {
        if (path.node.async) {
          maybeInjectGlobal(PromiseDependencies, getUtils(path));
        }
      },

      // for-of, [a, b] = c
      "ForOfStatement|ArrayPattern"(
        path: NodePath<t.ForOfStatement | t.ArrayPattern>,
      ) {
        maybeInjectGlobal(CommonIterators, getUtils(path));
      },

      // [...spread]
      SpreadElement(path: NodePath<t.SpreadElement>) {
        if (!path.parentPath.isObjectExpression()) {
          maybeInjectGlobal(CommonIterators, getUtils(path));
        }
      },

      // yield*
      YieldExpression(path: NodePath<t.YieldExpression>) {
        if (path.node.delegate) {
          maybeInjectGlobal(CommonIterators, getUtils(path));
        }
      },
    },
  };
});
