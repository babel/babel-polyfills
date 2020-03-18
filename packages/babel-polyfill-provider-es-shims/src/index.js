import { type PolyfillProvider } from "@babel/plugin-inject-polyfills";
import resolve from "resolve";
import debounce from "lodash.debounce";

import polyfills from "../data/polyfills.json";
import mappings from "../data/mappings.json";

export default ((
  { shouldInjectPolyfill, createMetaResolver, debug },
  options,
  dirname,
) => {
  const resolvePolyfill = createMetaResolver(mappings);

  const installedDeps = new Set();
  const missingDeps = new Set();

  function mark(desc) {
    debug(desc.name);

    const dep = `${desc.package}@^${desc.version}`;
    if (installedDeps.has(dep) || missingDeps.has(dep)) return;

    if (hasDependency(dirname, desc.package)) {
      installedDeps.add(dep);
    } else {
      missingDeps.add(dep);
    }
  }

  return {
    name: "es-shims",
    polyfills,

    usageGlobal(meta, utils) {
      const resolved = resolvePolyfill(meta);
      if (!resolved || !resolved.desc.global) return;
      if (!shouldInjectPolyfill(resolved.desc.name)) return;

      utils.injectGlobalImport(resolved.desc.global);
      mark(resolved.desc);
    },

    usagePure(meta, utils, path) {
      const resolved = resolvePolyfill(meta);
      if (!resolved || !resolved.desc.pure) return;
      if (!shouldInjectPolyfill(resolved.desc.name)) return;

      const id = utils.injectDefaultImport(
        resolved.desc.pure,
        resolved.desc.name,
      );
      mark(resolved.desc);

      path.replaceWith(id);
    },

    post() {
      if (options.missingDependencies?.log === "per-file") {
        logMissingDependencies(missingDeps);
      } else {
        laterLogMissingDependencies(missingDeps);
      }
    },
  };
}: PolyfillProvider<*>);

function hasDependency(basedir, name) {
  try {
    resolve.sync(name, { basedir });
    return true;
  } catch {
    return false;
  }
}

function logMissingDependencies(missingDeps) {
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
