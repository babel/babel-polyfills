// @flow

import defineProvider, {
  type Utils,
} from "@babel/helper-define-polyfill-provider";

import polyfills from "../data/compat.json";

import {
  type Descriptor,
  type Package,
  Globals,
  StaticProperties,
  InstanceProperties,
  DOMIterable,
} from "./mappings";

type Options = {|
  essential?: boolean,
  mode?: "cjs" | "esm",
|};

export default defineProvider<Options>(function(
  {
    method,
    getUtils,
    shouldInjectPolyfill,
    createMetaResolver,
    assertDependency,
    debug,
    babel,
  },
  options,
) {
  const opts = {
    mode:
      options.mode ??
      babel.caller(caller => (caller?.supportsStaticESM ? "esm" : "cjs")),
    essential: options.essential ?? false,
  };

  const resolvePolyfill = createMetaResolver<Descriptor>({
    global: Globals,
    static: StaticProperties,
    instance: InstanceProperties,
  });

  function getImport(pkg) {
    return `@ungap/${pkg.package}/${opts.mode}/index.js`;
  }

  function createDescIterator(cb: (string, Package, Utils, Object) => void) {
    return (meta, utils, path) => {
      const resolved = resolvePolyfill(meta);
      if (!resolved) return;

      const { name, regular, essential } = resolved.desc;
      const pkg = (opts.essential && essential) || regular;

      if (pkg && shouldInjectPolyfill(name)) {
        assertDependency(path, `@ungap/${pkg.package}`, pkg.version);
        cb(name, pkg, utils, path);
        debug(name);
      }
    };
  }

  return {
    name: "es-shims",
    polyfills,

    usageGlobal: createDescIterator((name, pkg, utils) => {
      utils.injectGlobalImport(getImport(pkg));
    }),

    usagePure: createDescIterator((name, pkg, utils, path) => {
      const id = utils.injectDefaultImport(getImport(pkg), name);
      path.replaceWith(id);
    }),

    visitor: method === "usage-global" && {
      "ForOfStatement|SpreadElement|ArrayPattern"(path) {
        const { name, regular } = DOMIterable;

        if (shouldInjectPolyfill(name) && regular) {
          assertDependency(path, `@ungap/${regular.package}`, regular.version);
          getUtils(path).injectGlobalImport(getImport(regular));
          debug(name);
        }
      },
    },
  };
});
