// @flow

import type { MetaDescriptor } from "@babel/plugin-inject-polyfills";

import { has } from "./utils";

type ObjectMap<T> = { [k: string]: T };

type ResolverPolyfills<T> = {
  global?: ObjectMap<T>,
  static?: ObjectMap<ObjectMap<T>>,
  instance?: ObjectMap<T>,
};

type ResolverFn<T> = (
  meta: MetaDescriptor,
) => void | { kind: "global" | "static" | "instance", desc: T, name: string };

const PossibleGlobalObjects = new Set<string>([
  "global",
  "globalThis",
  "self",
  "window",
]);

export default function createMetaResolver<T>(
  polyfills: ResolverPolyfills<T>,
): ResolverFn<T> {
  const { static: staticP, instance: instanceP, global: globalP } = polyfills;

  return meta => {
    if (meta.kind === "global" && globalP && has(globalP, meta.name)) {
      return { kind: "global", desc: globalP[meta.name], name: meta.name };
    }

    if (meta.kind === "property" || meta.kind === "in") {
      const { placement, object, key } = meta;

      if (object && placement === "static") {
        if (globalP && PossibleGlobalObjects.has(object) && has(globalP, key)) {
          return { kind: "global", desc: globalP[key], name: key };
        }

        if (staticP && has(staticP, object) && has(staticP[object], key)) {
          return {
            kind: "static",
            desc: staticP[object][key],
            name: `${object}$${key}`,
          };
        }
      }

      if (instanceP && has(instanceP, key)) {
        return { kind: "instance", desc: instanceP[key], name: `${key}` };
      }
    }
  };
}
