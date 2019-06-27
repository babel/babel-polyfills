// @flow

import { declare } from "@babel/helper-plugin-utils";
import * as traverse from "@babel/traverse";
import type { NodePath } from "@babel/traverse";

import getTargets from "@babel/preset-env/lib/targets-parser";
import { isPluginRequired } from "@babel/preset-env/lib/filter-items";

import {
  getImportSource,
  getRequireSource,
  resolveKey,
  resolveSource,
  createUtilsGetter,
} from "./utils";
import { createProviderDescriptors } from "./config";
import ImportsCache from "./imports-cache";
import {
  filterTargets,
  stringifyTargets,
  stringifyTargetsMultiline,
  presetEnvSilentDebugHeader,
} from "./debug-utils";

import type {
  ProviderApi,
  Options,
  Targets,
  MetaDescriptor,
  PolyfillProvider,
} from "./types";

export { resolveProvider } from "./config";
export { default as createMetaResolver } from "./meta-resolver";
export type { PolyfillProvider, MetaDescriptor };

function validateIncludeExclude(provider, names, include, exclude) {
  for (const name of exclude) {
    if (!names.has(name)) {
      throw new Error(
        `The "${provider}" provider doesn't ` +
          `support the "${name}" polyfill (used in "exclude").`,
      );
    }
  }

  for (const name of include) {
    if (!names.has(name)) {
      throw new Error(
        `The "${provider}" provider doesn't ` +
          `support the "${name}" polyfill (used in "include").`,
      );
    }
    if (exclude.has(name)) {
      throw new Error(
        `The "${name}" polyfill is both included and excluded ` +
          `(in the "${provider}" provider)`,
      );
    }
  }
}

export default declare((api, options: Options, dirname: string) => {
  api.assertVersion(7);

  const {
    method,
    providers,
    targets: targetsOption,
    ignoreBrowserslistConfig,
    configPath,
    debug,
  } = options;

  let methodName;
  if (method === "usage-global") methodName = "usageGlobal";
  else if (method === "entry-global") methodName = "entryGlobal";
  else if (method === "usage-pure") methodName = "usagePure";
  else if (typeof method !== "string") {
    throw new Error(".method must be a string");
  } else {
    throw new Error(
      `.method must be one of "entry-global", "usage-global"` +
        ` or "usage-pure" (received "${method}")`,
    );
  }

  if (!Array.isArray(providers) || providers.length === 0) {
    throw new Error(".providers must be an array with at least one element.");
  }

  const targets: Targets = getTargets(targetsOption, {
    ignoreBrowserslistConfig,
    configPath,
  });

  const providersDescriptors = createProviderDescriptors(providers, dirname);

  let debugLog = new Map();
  const getUtils = createUtilsGetter(new ImportsCache());

  const resolvedProviders = providersDescriptors.map(
    ({ value, options = {}, alias }) => {
      const include = new Set(options.include || []);
      const exclude = new Set(options.exclude || []);
      let polyfillsSupport;
      let polyfillsNames;
      let filterPolyfills;
      const thisDebugLog = new Map();

      const api: ProviderApi = {
        getUtils,
        method,
        targets,
        include,
        exclude,
        shouldInjectPolyfill(name) {
          if (polyfillsNames === undefined) {
            throw new Error(
              `Internal error in the ${alias} provider: ` +
                `shouldInjectPolyfill() can't be called during initialization.`,
            );
          }
          if (!polyfillsNames.has(name)) {
            throw new Error(
              `Internal error in the ${provider.name} provider: ` +
                `unknown polyfill "${name}".`,
            );
          }

          if (filterPolyfills && !filterPolyfills(name)) return false;
          if (include.has(name)) return true;
          if (exclude.has(name)) return false;
          if (!polyfillsSupport) return true;

          return isPluginRequired(targets, polyfillsSupport[name]);
        },
        debug(name: string) {
          if (!debug) return;
          // $FlowIgnore
          const thisDebugLog: Map<*, *> = debugLog.get(provider.name);
          if (thisDebugLog.has(provider.name)) return;
          thisDebugLog.set(name, polyfillsSupport && polyfillsSupport[name]);
        },
      };

      const provider = value(api, options);

      if (typeof provider[methodName] !== "function") {
        throw new Error(
          `The "${provider.name || alias}" provider doesn't ` +
            `support the "${method}" polyfilling method.`,
        );
      }

      if (Array.isArray(provider.polyfills)) {
        polyfillsNames = new Set(provider.polyfills);
        filterPolyfills = provider.filterPolyfills;
      } else if (provider.polyfills) {
        polyfillsNames = new Set(Object.keys(provider.polyfills));
        polyfillsSupport = provider.polyfills;
        filterPolyfills = provider.filterPolyfills;
      } else {
        polyfillsNames = new Set();
      }

      validateIncludeExclude(
        provider.name || alias,
        polyfillsNames,
        include,
        exclude,
      );

      debugLog.set(provider.name, thisDebugLog);

      return provider;
    },
  );

  function callProviders(payload: MetaDescriptor, path: NodePath) {
    const utils = getUtils(path);

    resolvedProviders.every(provider => {
      // $FlowIgnore
      provider[methodName](payload, utils, path);
      return !!path.node;
    });
  }

  function property(object, key, placement, path) {
    return callProviders({ kind: "property", object, key, placement }, path);
  }

  const entryVisitor = {
    ImportDeclaration(path) {
      const source = getImportSource(path);
      if (!source) return;
      callProviders({ kind: "import", source }, path);
    },
    Program(path: NodePath) {
      path.get("body").forEach(bodyPath => {
        const source = getRequireSource(bodyPath);
        if (!source) return;
        callProviders({ kind: "import", source }, bodyPath);
      });
    },
  };

  const usageVisitor = {
    // Symbol(), new Promise
    ReferencedIdentifier(path: NodePath) {
      const {
        node: { name },
        scope,
      } = path;
      if (scope.getBindingIdentifier(name)) return;

      callProviders({ kind: "global", name }, path);
    },

    MemberExpression(path: NodePath) {
      const key = resolveKey(path.get("property"), path.node.computed);
      if (!key || key === "prototype") return;

      const source = resolveSource(path.get("object"));
      return property(source.id, key, source.placement, path);
    },

    ObjectPattern(path: NodePath) {
      const { parentPath, parent } = path;
      let obj;

      // const { keys, values } = Object
      if (parentPath.isVariableDeclarator()) {
        obj = parentPath.get("init");
        // ({ keys, values } = Object)
      } else if (parentPath.isAssignmentExpression()) {
        obj = parentPath.get("right");
        // !function ({ keys, values }) {...} (Object)
        // resolution does not work after properties transform :-(
      } else if (parentPath.isFunction()) {
        const grand = parentPath.parentPath;
        if (grand.isCallExpression() || grand.isNewExpression()) {
          if (grand.node.callee === parent) {
            obj = grand.get("arguments")[path.key];
          }
        }
      }

      let id = null;
      let placement = null;
      if (obj) ({ id, placement } = resolveSource(obj));

      for (const prop of path.get("properties")) {
        if (prop.isObjectProperty()) {
          const key = resolveKey(prop.get("key"));
          if (key) property(id, key, placement, prop);
        }
      }
    },

    BinaryExpression(path: NodePath) {
      if (path.node.operator !== "in") return;

      const source = resolveSource(path.get("right"));
      const key = resolveKey(path.get("left"), true);

      if (!key) return;

      callProviders(
        {
          kind: "in",
          object: source.id,
          key,
          placement: source.placement,
        },
        path,
      );
    },
  };

  const visitors = [method === "entry-global" ? entryVisitor : usageVisitor];
  resolvedProviders.forEach(p => p.visitor && visitors.push(p.visitor));

  if (debug && debug !== presetEnvSilentDebugHeader) {
    console.log("@babel/plugin-inject-polyfills: `DEBUG` option");
    console.log(`\nUsing targets: ${stringifyTargetsMultiline(targets)}`);
    console.log(`\nUsing polyfills with \`${method}\` method:`);
  }

  return {
    name: "inject-polyfills",
    visitor: traverse.visitors.merge(visitors),
    pre() {
      debugLog = new Map(
        resolvedProviders.map(({ name }) => [name, new Map()]),
      );
    },
    post() {
      if (!debug) return;

      if (this.filename) console.log(`\n[${this.filename}]`);

      for (const [provider, polyfills] of debugLog) {
        if (!polyfills.size) {
          const reason =
            method === "entry-global" ? "code and targets" : "targets";
          console.log(
            `Based on your ${reason}, the ${provider} provider did not add any polyfill.`,
          );
          continue;
        }

        if (method === "entry-global") {
          console.log(
            `The ${provider} provider entry has been replaced with ` +
              `the following polyfills:`,
          );
        } else {
          console.log(
            `The ${provider} provider added the following polyfills:`,
          );
        }

        for (const [name, support] of polyfills) {
          if (support) {
            const filteredTargets = filterTargets(targets, support);
            const formattedTargets = stringifyTargets(filteredTargets);

            console.log(`  ${name} ${formattedTargets}`);
          } else {
            console.log(`  ${name}`);
          }
        }
      }
    },
  };
});
