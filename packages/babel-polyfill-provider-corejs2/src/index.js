// @flow

import corejs2Polyfills from "../data/corejs2-built-ins.json";
import {
  BuiltIns,
  StaticProperties,
  InstanceProperties,
} from "./built-in-definitions";
import getPlatformSpecificDefaultFor from "./get-platform-specific-default";
import { hasMinVersion } from "./helpers";

import {
  createMetaResolver,
  type PolyfillProvider,
} from "@babel/plugin-inject-polyfills";
import { types as t } from "@babel/core";

const resolve = createMetaResolver({
  global: BuiltIns,
  static: StaticProperties,
  instance: InstanceProperties,
});

const presetEnvCompat: "#__secret_key__@babel/preset-env__compatibility" =
  "#__secret_key__@babel/preset-env__compatibility";

type Options = {|
  version?: number | string,
  [typeof presetEnvCompat]: void | {
    entryInjectRegenerator: boolean,
  },
  include?: string[],
  exclude?: string[],
|};

export default ((
  { getUtils, method, targets, filterPolyfills },
  {
    version: runtimeVersion = "7.0.0-beta.0",
    [presetEnvCompat]: { entryInjectRegenerator } = {},
  },
) => {
  const polyfills = filterPolyfills(
    corejs2Polyfills,
    getPlatformSpecificDefaultFor(targets),
  );

  function inject(desc, utils) {
    if (typeof desc === "string") {
      if (polyfills.has(desc)) {
        utils.injectGlobalImport(`core-js/modules/${desc}`);
      }
      return;
    }

    desc.forEach(name => {
      if (polyfills.has(name)) {
        utils.injectGlobalImport(`core-js/modules/${name}`);
      }
    });
  }

  function maybeInjectPure(desc, hint, utils) {
    const { pure, meta, name } = desc;

    if (!pure) return;
    if (
      meta &&
      meta.minRuntimeVersion &&
      !hasMinVersion(meta.minRuntimeVersion, runtimeVersion)
    ) {
      return;
    }
    if (polyfills.has(name)) {
      return utils.injectDefaultImport(
        `@babel/runtime-corejs2/core-js/${pure}`,
        hint,
      );
    }
  }

  return {
    name: "corejs2",

    entryGlobal(meta, utils, path) {
      if (meta.kind === "import" && meta.source === "core-js") {
        for (const name of polyfills) {
          utils.injectGlobalImport(`core-js/modules/${name}`);
        }
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
                `@babel/runtime-corejs2/core-js/is-iterable`,
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
          polyfills.has("es6.symbol") &&
          path.parentPath.isCallExpression({ callee: path.node }) &&
          path.parent.arguments.length === 0
        ) {
          path.parentPath.replaceWith(
            t.callExpression(
              utils.injectDefaultImport(
                `@babel/runtime-corejs2/core-js/get-iterator`,
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
          inject("web.dom.iterable", getUtils(path));
        }
      },
    },
  };
}: PolyfillProvider<Options>);
