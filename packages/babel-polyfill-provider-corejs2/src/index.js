// @flow

import corejs2Polyfills from "@babel/compat-data/corejs2-built-ins";
import {
  BuiltIns,
  StaticProperties,
  InstanceProperties,
  CommonIterators,
} from "./built-in-definitions";
import addPlatformSpecificPolyfills from "./add-platform-specific-polyfills";
import { hasMinVersion } from "./helpers";

import type { PolyfillProvider } from "@babel/plugin-inject-polyfills";
import { types as t } from "@babel/core";

const presetEnvCompat: "#__secret_key__@babel/preset-env__compatibility" =
  "#__secret_key__@babel/preset-env__compatibility";

const has = Function.call.bind(Object.hasOwnProperty);

type Options = {|
  version?: number | string,
  [typeof presetEnvCompat]: void | {
    entryInjectRegenerator: boolean,
  },
|};

export default ((
  api,
  {
    version: runtimeVersion = "7.0.0-beta.0",
    [presetEnvCompat]: { entryInjectRegenerator } = {},
  },
) => {
  const resolve = api.createMetaResolver({
    global: BuiltIns,
    static: StaticProperties,
    instance: InstanceProperties,
  });

  const { debug, shouldInjectPolyfill, method } = api;

  const polyfills = addPlatformSpecificPolyfills(
    api.targets,
    method,
    corejs2Polyfills,
  );

  const coreJSBase =
    method === "usage-pure" ? "core-js/library/fn" : "core-js/modules";

  function inject(name, utils) {
    if (typeof name === "string") {
      if (shouldInjectPolyfill(name)) {
        debug(name);
        utils.injectGlobalImport(`${coreJSBase}/${name}`);
      }
      return;
    }

    name.forEach(name => inject(name, utils));
  }

  function injectIfAvailable(name, utils) {
    // Some polyfills aren't always available, for example
    // web.dom.iterable when targeting node
    if (has(polyfills, name)) inject(name, utils);
  }

  function maybeInjectPure(desc, hint, utils) {
    const { pure, meta, name } = desc;

    if (
      !pure ||
      !hasMinVersion(meta && meta.minRuntimeVersion, runtimeVersion) ||
      !shouldInjectPolyfill(name)
    ) {
      return;
    }

    return utils.injectDefaultImport(`${coreJSBase}/${pure}`, hint);
  }

  return {
    name: "corejs2",

    polyfills,

    entryGlobal(meta, utils, path) {
      if (meta.kind === "import" && meta.source === "core-js") {
        debug(null);

        inject(Object.keys(polyfills), utils);

        if (entryInjectRegenerator) {
          utils.injectGlobalImport("regenerator-runtime/runtime");
        }

        path.remove();
      }
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
        deps = deps.filter(m => m.includes(low));
      }

      inject(deps, utils);
    },

    usagePure(meta, utils, path) {
      if (meta.kind === "in") {
        if (meta.key === "Symbol.iterator") {
          path.replaceWith(
            t.callExpression(
              utils.injectDefaultImport(
                `${coreJSBase}/is-iterable`,
                "isIterable",
              ),
              [path.node.right],
            ),
          );
        }

        return;
      }

      if (meta.kind === "property") {
        // We can't compile destructuring.
        if (!path.isMemberExpression()) return;
        if (!path.isReferenced()) return;

        if (
          meta.key === "Symbol.iterator" &&
          shouldInjectPolyfill("es6.symbol") &&
          path.parentPath.isCallExpression({ callee: path.node }) &&
          path.parent.arguments.length === 0
        ) {
          path.parentPath.replaceWith(
            t.callExpression(
              utils.injectDefaultImport(
                `${coreJSBase}/get-iterator`,
                "getIterator",
              ),
              [path.node.object],
            ),
          );
          path.skip();

          return;
        }
      }

      const resolved = resolve(meta);
      if (!resolved) return;

      const id = maybeInjectPure(resolved.desc, resolved.name, utils);
      if (id) path.replaceWith(id);
    },

    visitor: method === "usage-global" && {
      // yield*
      YieldExpression(path) {
        if (path.node.delegate) {
          injectIfAvailable("web.dom.iterable", api.getUtils(path));
        }
      },

      // for-of, [a, b] = c
      "ForOfStatement|ArrayPattern"(path) {
        CommonIterators.forEach(name =>
          injectIfAvailable(name, api.getUtils(path)),
        );
      },
    },
  };
}: PolyfillProvider<Options>);
