import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";
import createMetaResolver from "./meta-resolver";

type ObjectMap<T> = { [k: string]: T };

export type Pattern = string | RegExp;

export type MissingDependenciesOption =
  | false
  | {
      log?: "per-file" | "deferred";
      inject?: "import" | "throw";
      // When true, log all the polyfills without checking if they are installed
      all?: boolean;
    };

export type ProviderOptions<Opts = {}> = {
  include?: Pattern[];
  exclude?: Pattern[];
} & Opts;

export type PluginOptions = {
  method: MethodString;
  targets?: {
    // @ts-expect-error - This is technically unsound, because the type of
    // "browsers" is not assignable to "string | number".
    browsers: string | string[];
    [target: string]: string | number;
  };
  ignoreBrowserslistConfig?: boolean;
  configPath?: string;
  debug?: boolean;
  include?: Pattern[];
  exclude?: Pattern[];
  shouldInjectPolyfill?: (name: string, shouldInject: boolean) => boolean;
  missingDependencies?: MissingDependenciesOption;
  absoluteImports?: boolean | string;
};

export type PolyfillProvider<Opts = {}> = (
  api: ProviderApi,
  options: ProviderOptions<Opts>,
  dirname: string,
) => ProviderResult;

export type PolyfillProviderInternal<Opts> = PolyfillProvider<Opts>;

export type MethodString = "entry-global" | "usage-global" | "usage-pure";

export type Targets = {
  [target: string]: string;
};

export type ProviderApi = {
  babel: any;
  method: MethodString;
  targets: Targets;
  createMetaResolver: typeof createMetaResolver;
  getUtils(path: NodePath): Utils;
  shouldInjectPolyfill(name: string): boolean;
  debug(name: string | null): void;
  assertDependency(name: string, version?: string): void;
};

export type Utils = {
  injectGlobalImport(url: string): void;
  injectNamedImport(url: string, name: string, hint?: string): t.Identifier;
  injectDefaultImport(url: string, hint?: string): t.Identifier;
};

export type ProviderResult = {
  name: string;
  polyfills?: string[] | { [name: string]: Targets };
  filterPolyfills?: (name: string) => boolean;
  entryGlobal?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void;
  usageGlobal?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void;
  usagePure?: (meta: MetaDescriptor, utils: Utils, path: NodePath) => void;
  visitor?: any;
  pre?: Function;
  post?: Function;
};

export type MetaDescriptor =
  | { kind: "import"; source: string }
  | { kind: "global"; name: string }
  | {
      kind: "property";
      placement: "static" | "prototype" | null;
      object: string | null;
      key: string;
    }
  | {
      kind: "in";
      placement: "static" | "prototype" | null;
      object: string | null;
      key: string;
    };

export type ResolverPolyfills<T> = {
  global?: ObjectMap<T>;
  static?: ObjectMap<ObjectMap<T>>;
  instance?: ObjectMap<T>;
};

export type ResolvedPolyfill<T> = {
  kind: "global" | "static" | "instance";
  name: string;
  desc: T;
};
