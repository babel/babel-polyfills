// @flow

// $FlowIgnore
const has = Function.call.bind(Object.hasOwnProperty);

export type Package = { version: string, package: string };

export type Descriptor = {
  name: string,
  regular?: Package,
  essential?: Package,
  global?: boolean,
  pure?: boolean,
};

export const DOMIterable: Descriptor = {
  name: "dom-iterable",
  regular: { package: "dom-iterable", version: "*" },
  global: true,
  pure: false,
};

export const Globals = {};
export const StaticProperties = {};
export const InstanceProperties = {};

/* == == == == == == == == == ECMAScript polyfills == == == == == == == == == */
defineGlobal("globalThis", ["global-this"]);
defineGlobal("JSON", ["json"]);
defineGlobal("Map", ["map", "0.1.4"], ["essential-map", "0.2.0"]);
defineGlobal("Set", ["set"], ["essential-set"]);
defineGlobal("Symbol", undefined, ["essential-symbol"]);
defineGlobal("WeakMap", ["weakmap"]);
defineGlobal("WeakSet", ["weakset"], ["essential-weakset"]);

defineStatic("Array", "isArray", ["is-array"]);
defineStatic("Object", "assign", ["assign"]);
defineStatic("Object", "fromEntries", ["from-entries"]);
defineStatic("Object", "getOwnPropertyDescriptors", [
  "get-own-property-descriptors",
]);
defineStatic("Promise", "allSettled", ["promise-all-settled"]);
defineStatic("Promise", "any", ["promise-any"]);

// defineInstance("Array", "Symbol.iterator", ["array-iterator"])
// defineInstance("Array", "item", ["item"])
// defineInstance("String", "trim", ["trim"])
// defineInstance("String", "trimStart", ["trim-start"])
// defineInstance("String", "trimEnd", ["trim-end"])

/* == == == == == == == == == == DOM polyfills == == == == == == == == == == */

defineGlobal("CustomEvent", ["custom-event"]);
defineGlobal("Event", ["event"]);
defineGlobal("EventTarget", ["event-target"]);
defineGlobal("URLSearchParams", ["url-search-params"]);

defineStatic("document", "importNode", ["import-node"]);

// defineInstance("Element", "matches", ["element-matches"])
// defineInstance("Node", "contains", ["node-contains"])

/* == == == == == == == == == == == Other == == == == == == == == == == == == */

// @ungap/dom-iterable
// @ungap/template-literal
// @ungap/template-tag-arguments

// @ungap/create-content
// @ungap/custom-elements-new

/* == == == == == == == == == == == == == == == == == == == == == == == == == */

function createDescriptor(reg, ess, opts) {
  /* eslint-disable no-var */
  if (reg) var name = reg[0];
  else if (ess) name = ess[0];
  else throw new Error();

  if (reg) var regular = { package: reg[0], version: reg[1] ?? "*" };
  if (ess) var essential = { package: ess[0], version: ess[1] ?? "*" };
  /* eslint-enable no-var */

  return { name, regular, essential, global: true, pure: true, ...opts };
}

function defineGlobal(name, regular, essential, opts) {
  Globals[name] = createDescriptor(regular, essential, opts);
}

function defineStatic(object, property, regular, essential, opts) {
  if (!has(StaticProperties, object)) StaticProperties[object] = {};
  StaticProperties[object][property] = createDescriptor(
    regular,
    essential,
    opts,
  );
}

/*function defineInstance(object, property, regular, essential, opts) {
  if (!has(InstanceProperties, property)) InstanceProperties[property] = [];

  InstanceProperties[property] = createDescriptor(regular, essential, opts);
}*/
