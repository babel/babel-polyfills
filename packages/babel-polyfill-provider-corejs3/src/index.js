import corejs3Polyfills from "core-js-compat/data";
import corejsEntries from "core-js-compat/entries";
import getModulesListForTargetVersion from "core-js-compat/get-modules-list-for-target-version";

const has = Function.call.bind(Object.hasOwnProperty);

function isCoreJSSource(source) {
  if (typeof source === "string") {
    source = source
      .replace(/\\/g, "/")
      .replace(/(\/(index)?)?(\.js)?$/i, "")
      .toLowerCase();
  }
  return has(corejsEntries, source) && corejsEntries[source];
}

function coreJSModule(name) {
  return `core-js/modules/${name}`;
}

export default ({ filterPolyfills }, { version = 3 }) => {
  const polyfills = filterPolyfills(corejs3Polyfills);
  const available = new Set(getModulesListForTargetVersion(version));

  function inject(name, utils) {
    if (typeof name === "string") {
      if (polyfills.has(name) && available.has(name)) {
        utils.injectGlobalImport(coreJSModule(name));
      }
    } else {
      name.forEach(n => inject(n, utils));
    }
  }

  return {
    entryGlobal(meta, utils, path) {
      if (meta.kind !== "import") return;

      const modules = isCoreJSSource(meta.source);
      if (!modules) return;

      if (modules.length === 1 && meta.source === coreJSModule(modules[0])) {
        // Avoid infinite loop: do not replace imports with a new copy of
        // themselves.
        return;
      }

      inject(modules, utils);
      path.remove();
    },

    usageGlobal() {
      throw new Error("TODO");
    },

    visitor: {},
  };
};
