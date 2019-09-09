import { type PolyfillProvider } from "@babel/plugin-inject-polyfills";
import resolve from "resolve";

import polyfills from "../data/polyfills.json";
import mappings from "../data/mappings.json";

export default ((
  { shouldInjectPolyfill, createMetaResolver, debug },
  options,
  dirname,
) => {
  const resolvePolyfill = createMetaResolver(mappings);

  const missingDeps = new Set();

  function mark(desc) {
    debug(desc.name);
    if (!hasDependency(dirname, desc.name)) missingDeps.add(desc.meta);
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

    visitor: {
      Program: {
        exit() {
          let deps = "";
          for (const { package: pkg, version } of missingDeps) {
            deps += ` ${pkg}@^${version}`;
          }

          console.warn(
            "\nSome polyfills have been added put are not present in your dependencies.\n" +
              "Please run one of the following commands:\n" +
              `\tnpm install --save${deps}\n` +
              `\tyarn add${deps}\n`,
          );
        },
      },
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
