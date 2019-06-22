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

type Options = {
  version?: number | string,
  include?: string[],
  exclude?: string[],
};

export default ((
  { getUtils, method, targets, filterPolyfills },
  { version: runtimeVersion = "7.0.0-beta.0" },
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

    desc.global.forEach(name => {
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

  const babelPolyfillPaths = new Set();

  return {
    name: "corejs2",

    entryGlobal(meta, utils, path) {
      if (
        meta.kind === "import" &&
        (meta.source === "@babel/polyfill" || meta.source === "core-js")
      ) {
        for (const name of polyfills) {
          utils.injectGlobalImport(`core-js/modules/${name}`);
        }

        // We can't remove this now because it is also used as an entry
        // point by the core-js polyfill. We will remove it on Program:exit.
        babelPolyfillPaths.add(path);
      }
    },

    usageGlobal(meta, utils) {
      if (meta.kind === "in" && meta.key === "Symbol.iterator") {
        inject("web.dom.iterable", utils);
      } else {
        const resolved = resolve(meta);
        if (resolved) inject(resolved.desc, utils);
      }
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

    visitor: {
      Program: {
        exit: () => babelPolyfillPaths.forEach(p => p.node && p.remove()),
      },

      // $FlowIgnore
      ...(method === "usage-global" && {
        // yield*
        YieldExpression(path) {
          if (path.node.delegate) {
            inject("web.dom.iterable", getUtils(path));
          }
        },
      }),
    },
  };
}: PolyfillProvider<Options>);
