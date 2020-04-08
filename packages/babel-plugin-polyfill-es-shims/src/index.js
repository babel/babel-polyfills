// @flow

import defineProvider, {
  type Utils,
} from "@babel/helper-define-polyfill-provider";

import polyfills from "../data/polyfills.json";

import {
  type Descriptor,
  Globals,
  StaticProperties,
  InstanceProperties,
} from "./mappings";

export default defineProvider<{||}>(function({
  shouldInjectPolyfill,
  assertDependency,
  createMetaResolver,
  debug,
}) {
  const resolvePolyfill = createMetaResolver<Descriptor[]>({
    global: Globals,
    static: StaticProperties,
    instance: InstanceProperties,
  });

  function createDescIterator(cb: (Descriptor, Utils, Object) => void) {
    return (meta, utils, path) => {
      const resolved = resolvePolyfill(meta);
      if (!resolved) return;

      for (const desc of resolved.desc) {
        if (shouldInjectPolyfill(desc.name)) cb(desc, utils, path);
      }
    };
  }

  return {
    name: "es-shims",
    polyfills,

    usageGlobal: createDescIterator((desc, utils) => {
      if (desc.global === false) return;

      assertDependency(desc.package, desc.version);

      utils.injectGlobalImport(`${desc.package}/auto.js`);

      debug(desc.name);
    }),

    usagePure: createDescIterator((desc, utils, path) => {
      if (desc.pure === false) return;

      assertDependency(desc.package, desc.version);

      const id = utils.injectDefaultImport(desc.package, desc.name);
      path.replaceWith(id);

      debug(desc.name);
    }),
  };
});
