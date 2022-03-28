import corejs2Polyfills from "@babel/compat-data/corejs2-built-ins";
import {
  BuiltIns,
  StaticProperties,
  InstanceProperties,
  CommonIterators,
} from "./built-in-definitions";
import addPlatformSpecificPolyfills from "./add-platform-specific-polyfills";
import { hasMinVersion } from "./helpers";

import defineProvider from "@babel/helper-define-polyfill-provider";
import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

const presetEnvCompat = "#__secret_key__@babel/preset-env__compatibility";
const runtimeCompat = "#__secret_key__@babel/runtime__compatibility";

const has = Function.call.bind(Object.hasOwnProperty);

type Options = {
  "#__secret_key__@babel/preset-env__compatibility": void | {
    entryInjectRegenerator: boolean;
  };
  "#__secret_key__@babel/runtime__compatibility": void | {
    useBabelRuntime: string;
    runtimeVersion: string;
    ext: string;
  };
};

export default defineProvider<Options>(function (
  api,
  {
    [presetEnvCompat]: { entryInjectRegenerator } = {
      entryInjectRegenerator: false,
    },
    [runtimeCompat]: { useBabelRuntime, runtimeVersion, ext = ".js" } = {
      useBabelRuntime: "",
      runtimeVersion: "",
    },
  },
) {
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

  const coreJSBase = useBabelRuntime
    ? `${useBabelRuntime}/core-js`
    : method === "usage-pure"
    ? "core-js/library/fn"
    : "core-js/modules";

  function inject(name: string | string[], utils) {
    if (typeof name === "string") {
      // Some polyfills aren't always available, for example
      // web.dom.iterable when targeting node
      if (has(polyfills, name) && shouldInjectPolyfill(name)) {
        debug(name);
        utils.injectGlobalImport(`${coreJSBase}/${name}.js`);
      }
      return;
    }

    name.forEach(name => inject(name, utils));
  }

  function maybeInjectPure(desc, hint, utils) {
    const { pure, meta, name } = desc;

    if (!pure || !shouldInjectPolyfill(name)) return;

    if (
      runtimeVersion &&
      meta &&
      meta.minRuntimeVersion &&
      !hasMinVersion(meta && meta.minRuntimeVersion, runtimeVersion)
    ) {
      return;
    }

    return utils.injectDefaultImport(`${coreJSBase}/${pure}${ext}`, hint);
  }

  return {
    name: "corejs2",

    polyfills,

    entryGlobal(meta, utils, path) {
      if (meta.kind === "import" && meta.source === "core-js") {
        debug(null);

        inject(Object.keys(polyfills), utils);

        if (entryInjectRegenerator) {
          utils.injectGlobalImport("regenerator-runtime/runtime.js");
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
        "object" in meta &&
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
                `${coreJSBase}/is-iterable${ext}`,
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
        // We can't compile destructuring.
        if (!path.isMemberExpression()) return;
        if (!path.isReferenced()) return;

        if (
          meta.key === "Symbol.iterator" &&
          shouldInjectPolyfill("es6.symbol") &&
          path.parentPath.isCallExpression({ callee: path.node }) &&
          path.parentPath.node.arguments.length === 0
        ) {
          path.parentPath.replaceWith(
            t.callExpression(
              utils.injectDefaultImport(
                `${coreJSBase}/get-iterator${ext}`,
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
      YieldExpression(path: NodePath<t.YieldExpression>) {
        if (path.node.delegate) {
          inject("web.dom.iterable", api.getUtils(path));
        }
      },

      // for-of, [a, b] = c
      "ForOfStatement|ArrayPattern"(
        path: NodePath<t.ForOfStatement | t.ArrayPattern>,
      ) {
        CommonIterators.forEach(name => inject(name, api.getUtils(path)));
      },
    },
  };
});
