const defineProvider = require("../..").default;

module.exports = defineProvider(function({ assertDependency }, options) {
  return {
    name: "es-shims",
    polyfills: Object.keys(options.globals),

    usageGlobal(meta, utils, path) {
      if (meta.kind === "global" && meta.name in options.globals) {
        assertDependency(path, options.globals[meta.name]);
        utils.injectGlobalImport(options.globals[meta.name]);
      }
    },
  };
});
