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
  PossibleGlobalObjects,
  StaticProperties,
  InstanceProperties,
} from "./built-in-definitions";

import { types as t } from "@babel/core";

import type { PolyfillProvider } from "@babel/plugin-inject-polyfills";

// $FlowIgnore
const has = Function.call.bind(Object.hasOwnProperty);

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

  function inject(name, utils) {
    if (typeof name === "string") {
      if (polyfills.has(name) && available.has(name)) {
        utils.injectGlobalImport(coreJSModule(name));
      }
    } else {
      name.forEach(n => inject(n, utils));
    }
  }

  function injectBuiltInDependencies(builtIn, utils) {
    if (has(BuiltIns, builtIn)) {
      inject(BuiltIns[builtIn].global, utils);
    }
  }

  function maybeInjectPure(desc, name, utils, object) {
    if (!desc.pure) return;
    if (object && desc.meta.exclude && desc.meta.exclude.includes(object)) {
      return;
    }
    if (!proposals && !desc.meta.stable) return;
    if (!desc.name || (polyfills.has(desc.name) && available.has(desc.name))) {
      return utils.injectDefaultImport(`${coreJSBase}/${desc.pure}`, name);
    }
  }

  function callMethod(path, id) {
    const { object } = path.node;

    let context1, context2;
    if (t.isIdentifier(object)) {
      context1 = object;
      context2 = t.cloneNode(object);
    } else {
      context1 = path.scope.generateDeclaredUidIdentifier("context");
      context2 = t.assignmentExpression("=", context1, object);
    }

    path.replaceWith(
      t.memberExpression(
        t.callExpression(id, [context2]),
        t.identifier("call"),
      ),
    );

    path.parentPath.unshiftContainer("arguments", context1);
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

      inject(modules, utils);
      path.remove();
    },

    usageGlobal(meta, utils) {
      if (meta.kind === "global") {
        if (!has(BuiltIns, meta.name)) return;

        inject(BuiltIns[meta.name].global, utils);
      }
      if (meta.kind === "property" || meta.kind === "in") {
        const { placement, object, key } = meta;

        if (placement === "static") {
          if (object && PossibleGlobalObjects.has(object)) {
            injectBuiltInDependencies(key, utils);
            return;
          }

          if (has(StaticProperties, object)) {
            const BuiltInProperties = StaticProperties[object];
            if (has(BuiltInProperties, key)) {
              inject(BuiltInProperties[key].global, utils);
            }
            return;
          }
        }

        if (!has(InstanceProperties, key)) return;
        let InstancePropertyDependencies = InstanceProperties[key].global;

        // Don't add polfyills for other classes.
        // e.g. [].includes -> YES es.array.includes, NO es.string.includes
        if (object && placement === "prototype") {
          const low = object.toLowerCase();
          InstancePropertyDependencies = InstancePropertyDependencies.filter(
            m => m.includes(low) || CommonInstanceDependencies.has(m),
          );
        }

        inject(InstancePropertyDependencies, utils);
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

        if (key === "Symbol.iterator") {
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

        if (placement === "static") {
          if (has(StaticProperties, object)) {
            const BuiltInProperties = StaticProperties[object];
            if (has(BuiltInProperties, key)) {
              const id = maybeInjectPure(
                BuiltInProperties[key],
                `${object}$${key}`,
                utils,
                object,
              );
              if (id) path.replaceWith(id);
              return;
            }
          }
        }

        if (!has(InstanceProperties, key)) return;

        const id = maybeInjectPure(
          InstanceProperties[key],
          `${key}InstanceProperty`,
          utils,
          object,
        );
        if (!id) return;

        if (isCall) {
          callMethod(path, id);
        } else {
          path.replaceWith(t.callExpression(id, [path.node.object]));
        }
      }

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
      }
    },

    visitor: method === "usage-global" && {
      // import("foo")
      CallExpression(path) {
        if (path.get("callee").isImport()) {
          inject(PromiseDependencies, getUtils(path));
        }
      },

      // (async function () { }).finally(...)
      Function(path) {
        if (path.node.async) {
          inject(PromiseDependencies, getUtils(path));
        }
      },

      // for-of, [a, b] = c
      "ForOfStatement|ArrayPattern"(path) {
        inject(CommonIterators, getUtils(path));
      },

      // [...spread]
      SpreadElement(path) {
        if (!path.parentPath.isObjectExpression()) {
          inject(CommonIterators, getUtils(path));
        }
      },

      // yield*
      YieldExpression(path) {
        if (path.node.delegate) {
          inject(CommonIterators, getUtils(path));
        }
      },
    },
  };
}: PolyfillProvider<Options>);
