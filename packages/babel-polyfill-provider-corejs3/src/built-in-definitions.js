// @flow

type ObjectMap<V> = { [name: string]: V };

type PolyfillDescriptor = {
  stable: boolean,
  pure: ?string,
  global: string[],
  support: string,
};

const descriptor = (stable: boolean) => (
  pure: ?string,
  global: string[],
  support: string = global[0],
  types: ?(string[]),
): PolyfillDescriptor => ({
  stable,
  pure,
  global,
  support,
  types,
});

const stable = descriptor(true);
const proposal = descriptor(false);

const typed = (name: string) => stable(null, [name, ...TypedArrayDependencies]);

const ArrayNatureIterators = [
  "es.array.iterator",
  "web.dom-collections.iterator",
];

export const CommonIterators = ["es.string.iterator", ...ArrayNatureIterators];

const ArrayNatureIteratorsWithTag = [
  "es.object.to-string",
  ...ArrayNatureIterators,
];

const CommonIteratorsWithTag = ["es.object.to-string", ...CommonIterators];

const TypedArrayDependencies = [
  "es.typed-array.copy-within",
  "es.typed-array.every",
  "es.typed-array.fill",
  "es.typed-array.filter",
  "es.typed-array.find",
  "es.typed-array.find-index",
  "es.typed-array.for-each",
  "es.typed-array.includes",
  "es.typed-array.index-of",
  "es.typed-array.iterator",
  "es.typed-array.join",
  "es.typed-array.last-index-of",
  "es.typed-array.map",
  "es.typed-array.reduce",
  "es.typed-array.reduce-right",
  "es.typed-array.reverse",
  "es.typed-array.set",
  "es.typed-array.slice",
  "es.typed-array.some",
  "es.typed-array.sort",
  "es.typed-array.subarray",
  "es.typed-array.to-locale-string",
  "es.typed-array.to-string",
  "es.object.to-string",
  "es.array.iterator",
  "es.array-buffer.slice",
];

const TypedArrayStaticMethods = {
  from: stable(null, ["es.typed-array.from"]),
  of: stable(null, ["es.typed-array.of"]),
};

export const PromiseDependencies = ["es.promise", "es.object.to-string"];

const PromiseDependenciesWithIterators = [
  ...PromiseDependencies,
  ...CommonIterators,
];

const SymbolDependencies = [
  "es.symbol",
  "es.symbol.description",
  "es.object.to-string",
];

const MapDependencies = [
  "es.map",
  "esnext.map.delete-all",
  "esnext.map.every",
  "esnext.map.filter",
  "esnext.map.find",
  "esnext.map.find-key",
  "esnext.map.includes",
  "esnext.map.key-of",
  "esnext.map.map-keys",
  "esnext.map.map-values",
  "esnext.map.merge",
  "esnext.map.reduce",
  "esnext.map.some",
  "esnext.map.update",
  ...CommonIteratorsWithTag,
];

const SetDependencies = [
  "es.set",
  "esnext.set.add-all",
  "esnext.set.delete-all",
  "esnext.set.difference",
  "esnext.set.every",
  "esnext.set.filter",
  "esnext.set.find",
  "esnext.set.intersection",
  "esnext.set.is-disjoint-from",
  "esnext.set.is-subset-of",
  "esnext.set.is-superset-of",
  "esnext.set.join",
  "esnext.set.map",
  "esnext.set.reduce",
  "esnext.set.some",
  "esnext.set.symmetric-difference",
  "esnext.set.union",
  ...CommonIteratorsWithTag,
];

const WeakMapDependencies = [
  "es.weak-map",
  "esnext.weak-map.delete-all",
  ...CommonIteratorsWithTag,
];

const WeakSetDependencies = [
  "es.weak-set",
  "esnext.weak-set.add-all",
  "esnext.weak-set.delete-all",
  ...CommonIteratorsWithTag,
];

const URLSearchParamsDependencies = ["web.url", ...CommonIteratorsWithTag];

export const BuiltIns: ObjectMap<PolyfillDescriptor> = {
  AggregateError: proposal("aggregate-error", [
    "esnext.aggregate-error",
    ...CommonIterators,
  ]),
  ArrayBuffer: stable(null, [
    "es.array-buffer.constructor",
    "es.array-buffer.slice",
    "es.object.to-string",
  ]),
  DataView: stable(null, [
    "es.data-view",
    "es.array-buffer.slice",
    "es.object.to-string",
  ]),
  Date: stable(null, ["es.date.to-string"]),
  Float32Array: typed("es.typed-array.float32-array"),
  Float64Array: typed("es.typed-array.float64-array"),
  Int8Array: typed("es.typed-array.int8-array"),
  Int16Array: typed("es.typed-array.int16-array"),
  Int32Array: typed("es.typed-array.int32-array"),
  Uint8Array: typed("es.typed-array.uint8-array"),
  Uint8ClampedArray: typed("es.typed-array.uint8-clamped-array"),
  Uint16Array: typed("es.typed-array.uint16-array"),
  Uint32Array: typed("es.typed-array.uint32-array"),
  Map: stable("map", MapDependencies),
  Number: stable(null, ["es.number.constructor"]),
  Observable: proposal("observable", [
    "esnext.observable",
    "esnext.symbol.observable",
    "es.object.to-string",
    ...CommonIteratorsWithTag,
  ]),
  Promise: stable("promise", PromiseDependencies),
  RegExp: stable(null, [
    "es.regexp.constructor",
    "es.regexp.exec",
    "es.regexp.to-string",
  ]),
  Set: stable("set", SetDependencies),
  Symbol: stable("symbol", SymbolDependencies),
  URL: stable("url", ["web.url", ...URLSearchParamsDependencies]),
  URLSearchParams: stable("url-search-params", URLSearchParamsDependencies),
  WeakMap: stable("weak-map", WeakMapDependencies),
  WeakSet: stable("weak-set", WeakSetDependencies),

  clearImmediate: stable("clear-immediate", ["web.immediate"]),
  compositeKey: proposal("composite-key", ["esnext.composite-key"]),
  compositeSymbol: proposal("composite-symbol", ["esnext.composite-symbol"]),
  fetch: stable(null, PromiseDependencies),
  globalThis: proposal("global-this", ["esnext.global-this"]),
  parseFloat: stable("parse-float", ["es.parse-float"]),
  parseInt: stable("parse-int", ["es.parse-int"]),
  queueMicrotask: stable("queue-microtask", ["web.queue-microtask"]),
  setImmediate: stable("set-immediate", ["web.immediate"]),
  setInterval: stable("set-interval", ["web.timers"]),
  setTimeout: stable("set-timeout", ["web.timers"]),
};

export const StaticProperties: ObjectMap<ObjectMap<PolyfillDescriptor>> = {
  Array: {
    from: stable("array/from", ["es.array.from", "es.string.iterator"]),
    isArray: stable("array/is-array", ["es.array.is-array"]),
    of: stable("array/of", ["es.array.of"]),
  },

  ArrayBuffer: {
    isView: stable(null, ["es.array-buffer.is-view"]),
  },

  Date: {
    now: stable("date/now", ["es.date.now"]),
  },

  JSON: {
    stringify: stable("json/stringify", []),
  },

  Math: {
    DEG_PER_RAD: proposal("math/deg-per-rad", ["esnext.math.deg-per-rad"]),
    RAD_PER_DEG: proposal("math/rad-per-deg", ["esnext.math.rad-per-deg"]),
    acosh: stable("math/acosh", ["es.math.acosh"]),
    asinh: stable("math/asinh", ["es.math.asinh"]),
    atanh: stable("math/atanh", ["es.math.atanh"]),
    cbrt: stable("math/cbrt", ["es.math.cbrt"]),
    clamp: proposal("math/clamp", ["esnext.math.clamp"]),
    clz32: stable("math/clz32", ["es.math.clz32"]),
    cosh: stable("math/cosh", ["es.math.cosh"]),
    degrees: proposal("math/degrees", ["esnext.math.degrees"]),
    expm1: stable("math/expm1", ["es.math.expm1"]),
    fround: stable("math/fround", ["es.math.fround"]),
    fscale: proposal("math/fscale", ["esnext.math.fscale"]),
    hypot: stable("math/hypot", ["es.math.hypot"]),
    iaddh: proposal("math/iaddh", ["esnext.math.iaddh"]),
    imul: stable("math/imul", ["es.math.imul"]),
    imulh: proposal("math/imulh", ["esnext.math.imulh"]),
    isubh: proposal("math/isubh", ["esnext.math.isubh"]),
    log10: stable("math/log10", ["es.math.log1p"]),
    log1p: stable("math/log1p", ["es.math.log10"]),
    log2: stable("math/log2", ["es.math.log2"]),
    radians: proposal("math/radians", ["esnext.math.radians"]),
    scale: proposal("math/scale", ["esnext.math.scale"]),
    seededPRNG: proposal("math/seeded-prng", ["esnext.math.seeded-prng"]),
    sign: stable("math/sign", ["es.math.sign"]),
    signbit: proposal("math/signbit", ["esnext.math.signbit"]),
    sinh: stable("math/sinh", ["es.math.sinh"]),
    tanh: stable("math/tanh", ["es.math.tanh"]),
    trunc: stable("math/trunc", ["es.math.trunc"]),
    umulh: proposal("math/umulh", ["esnext.math.umulh"]),
  },

  Map: {
    from: proposal(null, ["esnext.map.from", ...MapDependencies]),
    groupBy: proposal(null, ["esnext.map.group-by", ...MapDependencies]),
    keyBy: proposal(null, ["esnext.map.key-by", ...MapDependencies]),
    of: proposal(null, ["esnext.map.of", ...MapDependencies]),
  },

  Number: {
    EPSILON: stable("number/epsilon", ["es.number.epsilon"]),
    MAX_SAFE_INTEGER: stable("number/max-safe-integer", [
      "es.number.min-safe-integer",
    ]),
    MIN_SAFE_INTEGER: stable("number/min-safe-integer", [
      "es.number.max-safe-integer",
    ]),
    fromString: proposal("number/from-string", ["esnext.number.from-string"]),
    isFinite: stable("number/is-finite", ["es.number.is-finite"]),
    isInteger: stable("number/is-integer", ["es.number.is-integer"]),
    isNaN: stable("number/is-nan", ["es.number.is-safe-integer"]),
    isSafeInteger: stable("number/is-safe-integer", ["es.number.is-nan"]),
    parseFloat: stable("number/parse-float", ["es.number.parse-float"]),
    parseInt: stable("number/parse-int", ["es.number.parse-int"]),
  },

  Object: {
    assign: stable("object/assign", ["es.object.assign"]),
    create: stable("object/create", ["es.object.create"]),
    defineProperties: stable("object/define-properties", [
      "es.object.define-properties",
    ]),
    defineProperty: stable("object/define-property", [
      "es.object.define-property",
    ]),
    entries: stable("object/entries", ["es.object.entries"]),
    freeze: stable("object/freeze", ["es.object.freeze"]),
    fromEntries: stable("object/from-entries", [
      "es.object.from-entries",
      "es.array.iterator",
    ]),
    getOwnPropertyDescriptor: stable("object/get-own-property-descriptor", [
      "es.object.get-own-property-descriptor",
    ]),
    getOwnPropertyDescriptors: stable("object/get-own-property-descriptors", [
      "es.object.get-own-property-descriptors",
    ]),
    getOwnPropertyNames: stable("object/get-own-property-names", [
      "es.object.get-own-property-names",
    ]),
    getOwnPropertySymbols: stable("object/get-own-property-symbols", [
      "es.symbol",
    ]),
    getPrototypeOf: stable("object/get-prototype-of", [
      "es.object.get-prototype-of",
    ]),
    is: stable("object/is", ["es.object.is"]),
    isExtensible: stable("object/is-extensible", ["es.object.is-extensible"]),
    isFrozen: stable("object/is-frozen", ["es.object.is-frozen"]),
    isSealed: stable("object/is-sealed", ["es.object.is-sealed"]),
    keys: stable("object/keys", ["es.object.keys"]),
    preventExtensions: stable("object/prevent-extensions", [
      "es.object.prevent-extensions",
    ]),
    seal: stable("object/seal", ["es.object.seal"]),
    setPrototypeOf: stable("object/set-prototype-of", [
      "es.object.set-prototype-of",
    ]),
    values: stable("object/values", ["es.object.values"]),
  },

  Promise: {
    all: stable(null, PromiseDependenciesWithIterators),
    allSettled: proposal(null, [
      "esnext.promise.all-settled",
      ...PromiseDependenciesWithIterators,
    ]),
    any: proposal(null, [
      "esnext.promise.any",
      ...PromiseDependenciesWithIterators,
    ]),
    race: stable(null, PromiseDependenciesWithIterators),
    try: proposal(null, [
      "esnext.promise.try",
      ...PromiseDependenciesWithIterators,
    ]),
  },

  Reflect: {
    apply: stable("reflect/apply", ["es.reflect.apply"]),
    construct: stable("reflect/construct", ["es.reflect.construct"]),
    defineMetadata: proposal("reflect/define-metadata", [
      "esnext.reflect.define-metadata",
    ]),
    defineProperty: stable("reflect/define-property", [
      "es.reflect.define-property",
    ]),
    deleteMetadata: proposal("reflect/delete-metadata", [
      "esnext.reflect.delete-metadata",
    ]),
    deleteProperty: stable("reflect/delete-property", [
      "es.reflect.delete-property",
    ]),
    get: stable("reflect/get", ["es.reflect.get"]),
    getMetadata: proposal("reflect/get-metadata", [
      "esnext.reflect.get-metadata",
    ]),
    getMetadataKeys: proposal("reflect/get-metadata-keys", [
      "esnext.reflect.get-metadata-keys",
    ]),
    getOwnMetadata: proposal("reflect/get-own-metadata", [
      "esnext.reflect.get-own-metadata",
    ]),
    getOwnMetadataKeys: proposal("reflect/get-own-metadata-keys", [
      "esnext.reflect.get-own-metadata-keys",
    ]),
    getOwnPropertyDescriptor: stable("reflect/get-own-property-descriptor", [
      "es.reflect.get-own-property-descriptor",
    ]),
    getPrototypeOf: stable("reflect/get-prototype-of", [
      "es.reflect.get-prototype-of",
    ]),
    has: stable("reflect/has", ["es.reflect.has"]),
    hasMetadata: proposal("reflect/has-metadata", [
      "esnext.reflect.has-metadata",
    ]),
    hasOwnMetadata: proposal("reflect/has-own-metadata", [
      "esnext.reflect.has-own-metadata",
    ]),
    isExtensible: stable("reflect/is-extensible", ["es.reflect.is-extensible"]),
    metadata: proposal("reflect/metadata", ["esnext.reflect.metadata"]),
    ownKeys: stable("reflect/own-keys", ["es.reflect.own-keys"]),
    preventExtensions: stable("reflect/prevent-extensions", [
      "es.reflect.prevent-extensions",
    ]),
    set: stable("reflect/set", ["es.reflect.set"]),
    setPrototypeOf: stable("reflect/set-prototype-of", [
      "es.reflect.set-prototype-of",
    ]),
  },

  Set: {
    from: proposal(null, ["esnext.set.from", ...SetDependencies]),
    of: proposal(null, ["esnext.set.of", ...SetDependencies]),
  },

  String: {
    fromCodePoint: stable("string/from-code-point", [
      "es.string.from-code-point",
    ]),
    raw: stable("string/raw", ["es.string.raw"]),
  },

  Symbol: {
    asyncIterator: stable("symbol/async-iterator", [
      "es.symbol.async-iterator",
    ]),
    dispose: proposal("symbol/dispose", ["esnext.symbol.dispose"]),
    for: stable("symbol/for", [], "es.symbol"),
    hasInstance: stable("symbol/has-instance", [
      "es.symbol.has-instance",
      "es.function.has-instance",
    ]),
    isConcatSpreadable: stable("symbol/is-concat-spreadable", [
      "es.symbol.is-concat-spreadable",
      "es.array.concat",
    ]),
    iterator: stable("symbol/iterator", [
      "es.symbol.iterator",
      ...CommonIteratorsWithTag,
    ]),
    keyFor: stable("symbol/key-for", [], "es.symbol"),
    match: stable("symbol/match", ["es.symbol.match", "es.string.match"]),
    observable: proposal("symbol/observable", ["esnext.symbol.observable"]),
    patternMatch: proposal("symbol/pattern-match", [
      "esnext.symbol.pattern-match",
    ]),
    replace: stable("symbol/replace", [
      "es.symbol.replace",
      "es.string.replace",
    ]),
    search: stable("symbol/search", ["es.symbol.search", "es.string.search"]),
    species: stable("symbol/species", [
      "es.symbol.species",
      "es.array.species",
    ]),
    split: stable("symbol/split", ["es.symbol.split", "es.string.split"]),
    toPrimitive: stable("symbol/to-primitive", [
      "es.symbol.to-primitive",
      "es.date.to-primitive",
    ]),
    toStringTag: stable("symbol/to-string-tag", [
      "es.symbol.to-string-tag",
      "es.object.to-string",
      "es.math.to-string-tag",
      "es.json.to-string-tag",
    ]),
    unscopables: stable("symbol/unscopables", ["es.symbol.unscopables"]),
  },

  WeakMap: {
    from: proposal(null, ["esnext.weak-map.from", ...WeakMapDependencies]),
    of: proposal(null, ["esnext.weak-map.of", ...WeakMapDependencies]),
  },

  WeakSet: {
    from: proposal(null, ["esnext.weak-set.from", ...WeakSetDependencies]),
    of: proposal(null, ["esnext.weak-set.of", ...WeakSetDependencies]),
  },

  Int8Array: TypedArrayStaticMethods,
  Uint8Array: TypedArrayStaticMethods,
  Uint8ClampedArray: TypedArrayStaticMethods,
  Int16Array: TypedArrayStaticMethods,
  Uint16Array: TypedArrayStaticMethods,
  Int32Array: TypedArrayStaticMethods,
  Uint32Array: TypedArrayStaticMethods,
  Float32Array: TypedArrayStaticMethods,
  Float64Array: TypedArrayStaticMethods,
};

export const InstanceProperties = {
  at: proposal("at", ["esnext.string.at"]),
  anchor: stable(null, ["es.string.anchor"]),
  big: stable(null, ["es.string.big"]),
  bind: stable("bind", ["es.function.bind"]),
  blink: stable(null, ["es.string.blink"]),
  bold: stable(null, ["es.string.bold"]),
  codePointAt: stable("code-point-at", ["es.string.code-point-at"]),
  codePoints: proposal("code-points", ["esnext.string.code-points"]),
  concat: stable("concat", ["es.array.concat"], undefined, ["Array"]),
  copyWithin: stable("copy-within", ["es.array.copy-within"]),
  description: stable(null, ["es.symbol", "es.symbol.description"]),
  endsWith: stable("ends-with", ["es.string.ends-with"]),
  entries: stable("entries", ArrayNatureIteratorsWithTag),
  every: stable("every", ["es.array.every"]),
  exec: stable(null, ["es.regexp.exec"]),
  fill: stable("fill", ["es.array.fill"]),
  filter: stable("filter", ["es.array.filter"]),
  finally: stable(null, ["es.promise.finally", ...PromiseDependencies]),
  find: stable("find", ["es.array.find"]),
  findIndex: stable("find-index", ["es.array.find-index"]),
  fixed: stable(null, ["es.string.fixed"]),
  flags: stable("flags", ["es.regexp.flags"]),
  flatMap: stable("flat-map", [
    "es.array.flat-map",
    "es.array.unscopables.flat-map",
  ]),
  flat: stable("flat", [], "es.array.flat"),
  fontcolor: stable(null, ["es.string.fontcolor"]),
  fontsize: stable(null, ["es.string.fontsize"]),
  forEach: stable("for-each", [
    "es.array.for-each",
    "web.dom-collections.for-each",
  ]),
  includes: stable("includes", ["es.array.includes", "es.string.includes"]),
  indexOf: stable("index-of", ["es.array.index-of"]),
  italic: stable(null, ["es.string.italics"]),
  join: stable(null, ["es.array.join"]),
  keys: stable("keys", ArrayNatureIteratorsWithTag),
  lastIndex: stable(null, ["esnext.array.last-index"]),
  lastIndexOf: stable("last-index-of", ["es.array.last-index-of"]),
  lastItem: proposal(null, ["esnext.array.last-item"]),
  link: stable(null, ["es.string.link"]),
  map: stable("map", ["es.array.map"]),
  match: stable(null, ["es.string.match", "es.regexp.exec"]),
  matchAll: proposal("match-all", ["esnext.string.match-all"]),
  name: stable(null, ["es.function.name"]),
  padEnd: stable("pad-end", ["es.string.pad-end"]),
  padStart: stable("pad-start", ["es.string.pad-start"]),
  reduce: stable("reduce", ["es.array.reduce"]),
  reduceRight: stable("reduce-right", ["es.array.reduce-right"]),
  repeat: stable("repeat", ["es.string.repeat"]),
  replace: stable("replace-all", ["es.string.replace", "es.regexp.exec"]),
  replaceAll: proposal("reverse", ["esnext.string.replace-all"]),
  reverse: stable(null, ["es.string.reverse"]),
  search: stable(null, ["es.string.search", "es.regexp.exec"]),
  slice: stable("slice", ["es.array.slice"]),
  small: stable(null, ["es.string.small"]),
  some: stable("some", ["es.array.some"]),
  sort: stable("sort", ["es.array.sort"]),
  splice: stable("splice", ["es.array.splice"]),
  split: stable(null, ["es.string.split", "es.regexp.exec"]),
  startsWith: stable("starts-with", ["es.string.starts-with"]),
  strike: stable(null, ["es.string.strike"]),
  sub: stable(null, ["es.string.sub"]),
  sup: stable(null, ["es.string.sup"]),
  toFixed: stable(null, ["es.number.to-fixed"]),
  toISOString: stable(null, ["es.date.to-iso-string"]),
  toJSON: stable(null, ["es.date.to-json", "web.url.to-json"]),
  toPrecision: stable(null, ["es.number.to-precision"]),
  toString: stable(null, [
    "es.object.to-string",
    "es.regexp.to-string",
    "es.date.to-string",
  ]),
  trim: stable("trim", ["es.string.trim"]),
  trimEnd: stable("trim-end", ["es.string.trim-end"]),
  trimLeft: stable("trim-left", ["es.string.trim-start"]),
  trimRight: stable("trim-right", ["es.string.trim-end"]),
  trimStart: stable("trim-start", ["es.string.trim-start"]),
  values: stable("values", ArrayNatureIteratorsWithTag),
  __defineGetter__: stable(null, ["es.object.define-getter"]),
  __defineSetter__: stable(null, ["es.object.define-setter"]),
  __lookupGetter__: stable(null, ["es.object.lookup-getter"]),
  __lookupSetter__: stable(null, ["es.object.lookup-setter"]),
};

export const CommonInstanceDependencies = new Set<string>([
  "es.object.to-string",
  "es.object.define-getter",
  "es.object.define-setter",
  "es.object.lookup-getter",
  "es.object.lookup-setter",
  "es.regexp.exec",
]);

export const PossibleGlobalObjects = new Set<string>([
  "global",
  "globalThis",
  "self",
  "window",
]);
