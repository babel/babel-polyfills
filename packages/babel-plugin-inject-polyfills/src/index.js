// @flow

import { declare } from "@babel/helper-plugin-utils";
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
import { validateIncludeExclude } from "./normalize-options";

import type {
  ProviderApi,
  Options,
  Targets,
  MetaDescriptor,
  PolyfillProvider,
} from "./types";

import createMetaResolver from "./meta-resolver";

export { resolveProvider } from "./config";
export type { PolyfillProvider, MetaDescriptor };

export default declare((api, options: Options, dirname: string) => {
  api.assertVersion(7);
  const { traverse } = api;

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

  let debugLog;
  const getUtils = createUtilsGetter(new ImportsCache());

  const resolvedProviders = providersDescriptors.map(
    ({ value, options = {}, alias }) => {
      // eslint-disable-next-line prefer-const
      let include, exclude;
      let polyfillsSupport;
      let polyfillsNames;
      let filterPolyfills;

      const api: ProviderApi = {
        getUtils,
        method,
        targets,
        createMetaResolver,
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
        debug(name) {
          debugLog.providers.add(provider.name);

          if (!debug || !name) return;

          // $FlowIgnore
          const thisDebugLog: Map<*, *> = debugLog.polyfills.get(provider.name);
          if (thisDebugLog.has(provider.name)) return;
          thisDebugLog.set(
            name,
            polyfillsSupport && name && polyfillsSupport[name],
          );
        },
      };

      const provider = value(api, options, dirname);

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

      ({ include, exclude } = validateIncludeExclude(
        provider.name || alias,
        polyfillsNames,
        options.include || [],
        options.exclude || [],
      ));

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

      const object = path.get("object");
      const binding = object.scope.getBinding(object.node.name);
      if (binding && binding.path.isImportNamespaceSpecifier()) return;

      const source = resolveSource(object);
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
      debugLog = {
        polyfills: new Map(
          resolvedProviders.map(({ name }) => [name, new Map()]),
        ),
        providers: new Set(),
      };
    },
    post() {
      if (!debug) return;

      if (this.filename) console.log(`\n[${this.filename}]`);

      for (const [provider, polyfills] of debugLog.polyfills) {
        if (!polyfills.size) {
          console.log(
            method === "entry-global"
              ? debugLog.providers.has(provider)
                ? `Based on your targets, the ${provider} provider did not add any polyfill.`
                : `The entry point for the ${provider} provider has not been found.`
              : `Based on your code and targets, the ${provider} provider did not add any polyfill.`,
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
