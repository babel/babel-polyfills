import { declare } from "@babel/helper-plugin-utils";
import type { NodePath } from "@babel/traverse";

import _getTargets, {
  isRequired,
  getInclusionReasons,
} from "@babel/helper-compilation-targets";
const getTargets = _getTargets.default || _getTargets;

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
import * as deps from "./node/dependencies";

import createMetaResolver from "./meta-resolver";

export type { PolyfillProvider, MetaDescriptor, Utils, Targets } from "./types";

function resolveOptions<Options>(
  options: PluginOptions,
  babelApi,
): {
  method: MethodString;
  methodName: "usageGlobal" | "entryGlobal" | "usagePure";
  targets: Targets;
  debug: boolean | typeof presetEnvSilentDebugHeader;
  shouldInjectPolyfill:
    | ((name: string, shouldInject: boolean) => boolean)
    | undefined;
  providerOptions: ProviderOptions<Options>;
  absoluteImports: string | boolean;
} {
  const {
    method,
    targets: targetsOption,
    ignoreBrowserslistConfig,
    configPath,
    debug,
    shouldInjectPolyfill,
    absoluteImports,
    ...providerOptions
  } = options;

  if (isEmpty(options)) {
    throw new Error(
      `\
This plugin requires options, for example:
    {
      "plugins": [
        ["<plugin name>", { method: "usage-pure" }]
      ]
    }

See more options at https://github.com/babel/babel-polyfills/blob/main/docs/usage.md`,
    );
  }

  let methodName;
  if (method === "usage-global") methodName = "usageGlobal";
  else if (method === "entry-global") methodName = "entryGlobal";
  else if (method === "usage-pure") methodName = "usagePure";
  else if (typeof method !== "string") {
    throw new Error(".method must be a string");
  } else {
    throw new Error(
      `.method must be one of "entry-global", "usage-global"` +
        ` or "usage-pure" (received ${JSON.stringify(method)})`,
    );
  }

  if (typeof shouldInjectPolyfill === "function") {
    if (options.include || options.exclude) {
      throw new Error(
        `.include and .exclude are not supported when using the` +
          ` .shouldInjectPolyfill function.`,
      );
    }
  } else if (shouldInjectPolyfill != null) {
    throw new Error(
      `.shouldInjectPolyfill must be a function, or undefined` +
        ` (received ${JSON.stringify(shouldInjectPolyfill)})`,
    );
  }

  if (
    absoluteImports != null &&
    typeof absoluteImports !== "boolean" &&
    typeof absoluteImports !== "string"
  ) {
    throw new Error(
      `.absoluteImports must be a boolean, a string, or undefined` +
        ` (received ${JSON.stringify(absoluteImports)})`,
    );
  }

  let targets;

  if (
    // If any browserslist-related option is specified, fallback to the old
    // behavior of not using the targets specified in the top-level options.
    targetsOption ||
    configPath ||
    ignoreBrowserslistConfig
  ) {
    const targetsObj =
      typeof targetsOption === "string" || Array.isArray(targetsOption)
        ? { browsers: targetsOption }
        : targetsOption;

    targets = getTargets(targetsObj, {
      ignoreBrowserslistConfig,
      configPath,
    });
  } else {
    targets = babelApi.targets();
  }

  return {
    method,
    methodName,
    targets,
    absoluteImports: absoluteImports ?? false,
    shouldInjectPolyfill,
    debug: !!debug,
    providerOptions: providerOptions as any as ProviderOptions<Options>,
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
    shouldInjectPolyfill,
    providerOptions,
    absoluteImports,
  } = resolveOptions<Options>(options, babelApi);

  const getUtils = createUtilsGetter(
    new ImportsCache(moduleName =>
      deps.resolve(dirname, moduleName, absoluteImports),
    ),
  );

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
        console.warn(
          `Internal error in the ${provider.name} provider: ` +
            `unknown polyfill "${name}".`,
        );
      }

      if (filterPolyfills && !filterPolyfills(name)) return false;

      let shouldInject = isRequired(name, targets, {
        compatData: polyfillsSupport,
        includes: include,
        excludes: exclude,
      });

      if (shouldInjectPolyfill) {
        shouldInject = shouldInjectPolyfill(name, shouldInject);
        if (typeof shouldInject !== "boolean") {
          throw new Error(`.shouldInjectPolyfill must return a boolean.`);
        }
      }

      return shouldInject;
    },
    debug(name) {
      debugLog().found = true;

      if (!debug || !name) return;

      if (debugLog().polyfills.has(provider.name)) return;
      debugLog().polyfills.add(name);
      debugLog().polyfillsSupport ??= polyfillsSupport;
    },
    assertDependency(name, version = "*") {
      if (missingDependencies === false) return;
      if (absoluteImports) {
        // If absoluteImports is not false, we will try resolving
        // the dependency and throw if it's not possible. We can
        // skip the check here.
        return;
      }

      const dep = version === "*" ? name : `${name}@^${version}`;

      const found = missingDependencies.all
        ? false
        : mapGetOr(depsCache, `${name} :: ${dirname}`, () =>
            deps.has(dirname, name),
          );

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

    const { debug, method, targets, provider, callProvider } =
      instantiateProvider<Options>(
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
          polyfills: new Set(),
          polyfillsSupport: undefined,
          found: false,
          providers: new Set(),
          missingDeps: new Set(),
        };

        provider.pre?.apply(this, arguments);
      },
      post() {
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

        for (const name of debugLog.polyfills) {
          if (debugLog.polyfillsSupport?.[name]) {
            const filteredTargets = getInclusionReasons(
              name,
              targets,
              debugLog.polyfillsSupport,
            );

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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
