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

export default (
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
      inject(BuiltIns[builtIn], utils);
    }
  }

  return {
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

        inject(BuiltIns[meta.name], utils);
      }
      if (meta.kind === "property" || meta.kind === "in") {
        const { placement, object, key } = meta;

        if (placement === "static") {
          if (PossibleGlobalObjects.has(object)) {
            injectBuiltInDependencies(key, utils);
            return;
          }

          if (has(StaticProperties, object)) {
            const BuiltInProperties = StaticProperties[object];
            if (has(BuiltInProperties, key)) {
              inject(BuiltInProperties[key], utils);
            }
            return;
          }
        }

        if (!has(InstanceProperties, key)) return;
        let InstancePropertyDependencies = InstanceProperties[key];

        // Don't add polfyiils for other classes.
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
};
