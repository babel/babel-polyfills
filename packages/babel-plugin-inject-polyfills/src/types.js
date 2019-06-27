// @flow

import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

type ObjectMap<T> = { [k: string]: T };

export type Options = {
  method: MethodString,
  providers: Array<string | [string] | [string, ProviderOptions]>,
  targets?: { browsers: string | string[], [target: string]: string | number },
  ignoreBrowserslistConfig?: boolean,
  configPath?: string,
};

export type ProviderOptions = {
  include?: string[],
  exclude?: string[],
};

export type PolyfillProvider<Opts: ProviderOptions = ProviderOptions> = (
  api: ProviderApi,
  options: Opts,
) => ProviderResult;

export type MethodString = "entry-global" | "usage-global" | "usage-pure";

export type Targets = {
  [target: string]: string,
};

export type ProviderApi = {|
  method: MethodString,
  targets: Targets,
  include: Set<string>,
  exclude: Set<string>,
  getUtils(path: NodePath): Utils,
  shouldInjectPolyfill(name: string): boolean,
|};

export type Utils = {|
  injectGlobalImport(url: string): void,
  injectNamedImport(url: string, name: string, hint?: string): t.Identifier,
  injectDefaultImport(url: string, hint?: string): t.Identifier,
|};

export type ProviderResult = {|
  name: string,
  polyfills?: string[] | { [name: string]: Targets },
  filterPolyfills?: (name: string) => boolean,
  entryGlobal?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void,
  usageGlobal?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void,
  usagePure?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void,
  visitor?: Object,
|};

export type MetaDescriptor =
  | {| kind: "import", source: string |}
  | {| kind: "global", name: string |}
  | {|
      kind: "property",
      placement: ?("static" | "prototype"),
      object: ?string,
      key: string,
    |}
  | {|
      kind: "in",
      placement: ?("static" | "prototype"),
      object: ?string,
      key: string,
    |};

export type ResolverPolyfills<T> = {
  global?: ObjectMap<T>,
  static?: ObjectMap<ObjectMap<T>>,
  instance?: ObjectMap<T>,
};

export type ResolvedPolyfill<T> = {
  kind: "global" | "static" | "instance",
  name: string,
  desc: T,
};
