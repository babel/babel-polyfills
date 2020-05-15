// @flow

import { declare } from "@babel/helper-plugin-utils";
import type { NodePath } from "@babel/traverse";

import getTargets, {
  isRequired,
  getInclusionReasons,
} from "@babel/helper-compilation-targets";

import { createUtilsGetter } from "./utils";
import ImportsCache from "./imports-cache";
import {
  stringifyTargetsMultiline,
  presetEnvSilentDebugHeader,
} from "./debug-utils";
import {
  validateIncludeExclude,
  applyMissingDependenciesDefaults,
} from "./normalize-options";

import type {
  ProviderApi,
  MethodString,
  Targets,
  MetaDescriptor,
  PolyfillProvider,
  PluginOptions,
  ProviderOptions,
} from "./types";

import * as v from "./visitors";
import * as deps from "./dependencies";

import createMetaResolver from "./meta-resolver";

export type { PolyfillProvider, MetaDescriptor, Utils, Targets } from "./types";

function resolveOptions<Options>(
  options: PluginOptions,
): {
  method: MethodString,
  methodName: "usageGlobal" | "entryGlobal" | "usagePure",
  targets: Targets,
  debug: boolean,
  providerOptions: ProviderOptions<Options>,
} {
  const {
    method,
    targets: targetsOption,
    ignoreBrowserslistConfig,
    configPath,
    debug,
    ...providerOptions
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

  const targets: Targets = getTargets(targetsOption, {
    ignoreBrowserslistConfig,
    configPath,
  });

  return {
    method,
    methodName,
    targets,
    debug: !!debug,
    providerOptions: ((providerOptions: Object): ProviderOptions<Options>),
  };
}

function instantiateProvider<Options>(
  factory: PolyfillProvider<Options>,
  options: PluginOptions,
  missingDependencies,
  dirname,
  debugLog,
  babelApi,
) {
  const {
    method,
    methodName,
    targets,
    debug,
    providerOptions,
  } = resolveOptions<Options>(options);

  const getUtils = createUtilsGetter(new ImportsCache());

  // eslint-disable-next-line prefer-const
  let include, exclude;
  let polyfillsSupport;
  let polyfillsNames;
  let filterPolyfills;

  const depsCache = new Map();

  const api: ProviderApi = {
    babel: babelApi,
    getUtils,
    method: options.method,
    targets,
    createMetaResolver,
    shouldInjectPolyfill(name) {
      if (polyfillsNames === undefined) {
        throw new Error(
          `Internal error in the ${factory.name} provider: ` +
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

      return isRequired(name, targets, {
        compatData: polyfillsSupport,
        includes: include,
        excludes: exclude,
      });
    },
    debug(name) {
      debugLog().found = true;

      if (!debug || !name) return;

      if (debugLog().polyfills.has(provider.name)) return;
      debugLog().polyfills.set(
        name,
        polyfillsSupport && name && polyfillsSupport[name],
      );
    },
    assertDependency(name, version = "*") {
      if (missingDependencies === false) return;

      const dep = version === "*" ? name : `${name}@^${version}`;

      const found = missingDependencies.all
        ? false
        : mapGetOr(depsCache, name, () => deps.has(dirname, name));

      if (!found) {
        debugLog().missingDeps.add(dep);
      }
    },
  };

  const provider = factory(api, providerOptions, dirname);

  if (typeof provider[methodName] !== "function") {
    throw new Error(
      `The "${provider.name || factory.name}" provider doesn't ` +
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
    provider.name || factory.name,
    polyfillsNames,
    providerOptions.include || [],
    providerOptions.exclude || [],
  ));

  return {
    debug,
    method,
    targets,
    provider,
    callProvider(payload: MetaDescriptor, path: NodePath) {
      const utils = getUtils(path);
      // $FlowIgnore
      provider[methodName](payload, utils, path);
    },
  };
}

export default function definePolyfillProvider<Options>(
  factory: PolyfillProvider<Options>,
) {
  return declare((babelApi, options: PluginOptions, dirname: string) => {
    babelApi.assertVersion(7);
    const { traverse } = babelApi;

    let debugLog;

    const missingDependencies = applyMissingDependenciesDefaults(
      options,
      babelApi,
    );

    const {
      debug,
      method,
      targets,
      provider,
      callProvider,
    } = instantiateProvider<Options>(
      factory,
      options,
      missingDependencies,
      dirname,
      () => debugLog,
      babelApi,
    );

    const createVisitor = method === "entry-global" ? v.entry : v.usage;

    const visitor = provider.visitor
      ? traverse.visitors.merge([createVisitor(callProvider), provider.visitor])
      : createVisitor(callProvider);

    if (debug && debug !== presetEnvSilentDebugHeader) {
      console.log(`${provider.name}: \`DEBUG\` option`);
      console.log(`\nUsing targets: ${stringifyTargetsMultiline(targets)}`);
      console.log(`\nUsing polyfills with \`${method}\` method:`);
    }

    return {
      name: "inject-polyfills",
      visitor,

      pre() {
        debugLog = {
          polyfills: new Map(),
          found: false,
          providers: new Set(),
          missingDeps: new Set(),
        };

        // $FlowIgnore - Flow doesn't support optional calls
        provider.pre?.apply(this, arguments);
      },
      post() {
        // $FlowIgnore - Flow doesn't support optional calls
        provider.post?.apply(this, arguments);

        if (missingDependencies !== false) {
          if (missingDependencies.log === "per-file") {
            deps.logMissing(debugLog.missingDeps);
          } else {
            deps.laterLogMissing(debugLog.missingDeps);
          }
        }

        if (!debug) return;

        if (this.filename) console.log(`\n[${this.filename}]`);

        if (debugLog.polyfills.size === 0) {
          console.log(
            method === "entry-global"
              ? debugLog.found
                ? `Based on your targets, the ${provider.name} polyfill did not add any polyfill.`
                : `The entry point for the ${provider.name} polyfill has not been found.`
              : `Based on your code and targets, the ${provider.name} polyfill did not add any polyfill.`,
          );

          return;
        }

        if (method === "entry-global") {
          console.log(
            `The ${provider.name} polyfill entry has been replaced with ` +
              `the following polyfills:`,
          );
        } else {
          console.log(
            `The ${provider.name} polyfill added the following polyfills:`,
          );
        }

        for (const [name, support] of debugLog.polyfills) {
          if (support) {
            const filteredTargets = getInclusionReasons(name, targets, support);

            const formattedTargets = JSON.stringify(filteredTargets)
              .replace(/,/g, ", ")
              .replace(/^\{"/, '{ "')
              .replace(/"\}$/, '" }');

            console.log(`  ${name} ${formattedTargets}`);
          } else {
            console.log(`  ${name}`);
          }
        }
      },
    };
  });
}

function mapGetOr(map, key, getDefault) {
  let val = map.get(key);
  if (val === undefined) {
    val = getDefault();
    map.set(key, val);
  }
  return val;
}
