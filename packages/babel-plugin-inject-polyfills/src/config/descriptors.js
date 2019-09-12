// NOTE: Copied from packages/babel-core/src/config/config-descriptors.js

// @flow

import { loadProvider } from "./loader";
import type { ProviderOptions, PolyfillProvider } from "../types";

// Represents a plugin or presets at a given location in a config object.
// At this point these have been resolved to a specific object or function,
// but have not yet been executed to call functions with options.
export type UnloadedDescriptor = {
  name: string | void,
  value: PolyfillProvider<*>,
  options: ProviderOptions<*> | void,
  alias: string,
  file?: {
    request: string,
    resolved: string,
  } | void,
};

export function createProviderDescriptors(
  items: *, //PluginList
  dirname: string,
): Array<UnloadedDescriptor> {
  const descriptors = items.map((item, index) =>
    createDescriptor(item, `$${index}`, dirname),
  );

  assertNoDuplicates(descriptors);

  return descriptors;
}

function createDescriptor(
  pair: *, // PluginItem,
  alias: string,
  dirname: string,
): UnloadedDescriptor {
  let name;
  let options;
  let value = pair;
  if (Array.isArray(value)) {
    if (value.length === 3) {
      [value, options, name] = value;
    } else {
      [value, options] = value;
    }
  }

  let file = undefined;
  let filepath = null;
  if (typeof value === "string") {
    const request = value;

    ({ filepath, value } = loadProvider(value, dirname));

    file = {
      request,
      resolved: filepath,
    };
  }

  if (!value) {
    throw new Error(`Unexpected falsy value: ${String(value)}`);
  }

  if (typeof value === "object" && value.__esModule) {
    if (value.default) {
      value = value.default;
    } else {
      throw new Error("Must export a default export when using ES6 modules.");
    }
  }

  if (typeof value !== "function" && value !== null) {
    throw new Error(
      `Polyfill proviers are only allowed to export functions. (${filepath ||
        (file && file.request) ||
        "unknown"})`,
    );
  }

  if (filepath !== null && typeof value === "object" && value) {
    // We allow object values for plugins/presets nested directly within a
    // config object, because it can be useful to define them in nested
    // configuration contexts.
    throw new Error(
      `Plugin/Preset files are not allowed to export objects, only functions. In ${filepath}`,
    );
  }

  return {
    name,
    alias: filepath || alias,
    value: (value: Function),
    options,
    file,
  };
}

function assertNoDuplicates(items: Array<UnloadedDescriptor>): void {
  const map = new Map();

  for (const item of items) {
    if (typeof item.value !== "function") continue;

    let nameMap = map.get(item.value);
    if (!nameMap) {
      nameMap = new Set();
      map.set(item.value, nameMap);
    }

    if (nameMap.has(item.name)) {
      throw new Error(
        [
          `Duplicate polyfill provider detected.`,
          `If you'd like to use two separate instances of a provider,`,
          `they need separate names, e.g.`,
          ``,
          `  providers: [`,
          `    ['some-provider', {}],`,
          `    ['some-provider', {}, 'some unique name'],`,
          `  ]`,
        ].join("\n"),
      );
    }

    nameMap.add(item.name);
  }
}
