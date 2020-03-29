// @flow

import defineProvider, {
  type Utils,
} from "@babel/helper-define-polyfill-provider";

import resolve from "resolve";
import debounce from "lodash.debounce";

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
  missingDependencies?: {
    log?: "per-file" | "deferred",
    // When true, log all the polyfills without checking if they are installed
    all?: boolean,
  },
|};

export default defineProvider<Options>(function(
  { method, getUtils, shouldInjectPolyfill, createMetaResolver, debug, babel },
  options,
  dirname,
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

  const installedDeps = new Set();
  const missingDeps = new Set();

  function mark(name, pkg) {
    debug(name);

    const pkgName = `@ungap/${pkg.package}`;

    const dep = `${pkgName}@^${pkg.version}`;
    if (installedDeps.has(dep) || missingDeps.has(dep)) return;

    if (options.missingDependencies?.all || !hasDependency(dirname, pkgName)) {
      missingDeps.add(dep);
    } else {
      installedDeps.add(dep);
    }
  }

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
        cb(name, pkg, utils, path);
        mark(name, pkg);
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

    post() {
      if (options.missingDependencies?.log === "per-file") {
        logMissingDependencies(missingDeps);
      } else {
        laterLogMissingDependencies(missingDeps);
      }
    },

    visitor: method === "usage-global" && {
      "ForOfStatement|SpreadElement|ArrayPattern"(path) {
        const { name, regular } = DOMIterable;

        if (shouldInjectPolyfill(name) && regular) {
          getUtils(path).injectGlobalImport(getImport(regular));
          mark(name, regular);
        }
      },
    },
  };
});

function hasDependency(basedir, name) {
  try {
    resolve.sync(name, { basedir });
    return true;
  } catch {
    return false;
  }
}

function logMissingDependencies(missingDeps) {
  if (missingDeps.size === 0) return;

  const deps = Array.from(missingDeps)
    .sort()
    .join(" ");

  console.warn(
    "\nSome polyfills have been added but are not present in your dependencies.\n" +
      "Please run one of the following commands:\n" +
      `\tnpm install --save ${deps}\n` +
      `\tyarn add ${deps}\n`,
  );
}

const laterLogMissingDependencies = (() => {
  let allMissingDeps = new Set();

  const laterLogMissingDependencies = debounce(() => {
    logMissingDependencies(allMissingDeps);
    allMissingDeps = new Set();
  }, 1000);

  return missingDeps => {
    missingDeps.forEach(name => allMissingDeps.add(name));
    laterLogMissingDependencies();
  };
})();
