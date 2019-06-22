// @flow

import corejs3Polyfills from "core-js-compat/data";
import corejs3ShippedProposalsList from "./shipped-proposals";
import corejsEntries from "core-js-compat/entries";
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
import { createResolver } from "./resolver";
import { has, callMethod } from "./utils";

import type { PolyfillProvider } from "@babel/plugin-inject-polyfills";

const corejs3PolyfillsWithoutProposals = Object.keys(corejs3Polyfills)
  .filter(name => !name.startsWith("esnext."))
  .reduce((memo, key) => {
    memo[key] = corejs3Polyfills[key];
    return memo;
  }, {});

const corejs3PolyfillsWithShippedProposals = corejs3ShippedProposalsList.reduce(
  (memo, key) => {
    memo[key] = corejs3Polyfills[key];
    return memo;
  },
  { ...corejs3PolyfillsWithoutProposals },
);

function isCoreJSSource(source) {
  if (typeof source === "string") {
    source = source
      .replace(/\\/g, "/")
      .replace(/(\/(index)?)?(\.js)?$/i, "")
      .toLowerCase();
  }
  return has(corejsEntries, source) && corejsEntries[source];
}

function coreJSModule(name) {
  return `core-js/modules/${name}`;
}

type Options = {
  version?: number | string,
  proposals?: boolean,
  shippedProposals?: boolean,
  include?: string[],
  exclude?: string[],
};

// Without the space after > it breaks my editor's syntax highlighting
// prettier-ignore
const resolve = createResolver<CoreJSPolyfillDescriptor> ({
  global: BuiltIns,
  static: StaticProperties,
  instance: InstanceProperties,
});

export default ((
  { filterPolyfills, getUtils, method },
  { version = 3, proposals, shippedProposals },
) => {
  const polyfills = filterPolyfills(
    proposals || method === "entry-global"
      ? corejs3Polyfills
      : shippedProposals
      ? corejs3PolyfillsWithShippedProposals
      : corejs3PolyfillsWithoutProposals,
  );
  const available = new Set(getModulesListForTargetVersion(version));
  const coreJSBase = proposals
    ? "@babel/runtime-corejs3/core-js"
    : "@babel/runtime-corejs3/core-js-stable";

  function shouldInject(name, meta, object) {
    if (meta) {
      if (object && meta.exclude && meta.exclude.includes(object)) {
        return false;
      }
      if (!proposals && !meta.stable) return false;
    }

    return !name || (polyfills.has(name) && available.has(name));
  }

  function maybeInjectGlobal(names: string[], utils) {
    for (const name of names) {
      if (shouldInject(name)) utils.injectGlobalImport(coreJSModule(name));
    }
  }

  function maybeInjectPure(
    desc: CoreJSPolyfillDescriptor,
    hint,
    utils,
    object,
  ) {
    if (desc.pure && shouldInject(desc.name, desc.meta, object)) {
      return utils.injectDefaultImport(`${coreJSBase}/${desc.pure}`, hint);
    }
  }

  return {
    name: "corejs3",

    entryGlobal(meta, utils, path) {
      if (meta.kind !== "import") return;

      const modules = isCoreJSSource(meta.source);
      if (!modules) return;

      if (modules.length === 1 && meta.source === coreJSModule(modules[0])) {
        // Avoid infinite loop: do not replace imports with a new copy of
        // themselves.
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
          if (!polyfills.has("es.symbol.iterator")) return;

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

// This is at the end because it breaks my VSCode's syntax highlighting
