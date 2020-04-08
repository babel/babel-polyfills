// @flow

// $FlowIgnore
const has = Function.call.bind(Object.hasOwnProperty);

export type Descriptor = {
  name: string,
  version: string,
  package: string,
  pure?: false,
  global?: false,
};

export const Globals = {};
export const StaticProperties = {};
export const InstanceProperties = {};

defineGlobal("globalThis", "1.0.0", "globalThis");

defineGlobal("AggregateError", "1.0.2", "es-aggregate-error");

defineStatic("Array", "from", "1.1.0");
defineStatic("Array", "of", "1.0.0");
defineInstance("Array", "entries", "1.0.0");
defineInstance("Array", "every", "1.1.0");
defineInstance("Array", "find", "2.1.1");
defineInstance("Array", "findIndex", "2.1.0");
defineInstance("Array", "flat", "1.2.3");
defineInstance("Array", "flatMap", "1.2.3");
defineInstance("Array", "includes", "3.1.1", "array-includes");
defineInstance("Array", "indexOf", "1.0.0");
defineInstance("Array", "keys", "1.0.0");
defineInstance("Array", "lastIndexOf", "1.0.0");
defineInstance("Array", "map", "1.0.2");
defineInstance("Array", "reduce", "1.0.1");
defineInstance("Array", "reduceRight", "1.0.1");
defineInstance("Array", "some", "1.1.1");
defineInstance("Array", "values", "1.0.0");

defineInstance("Function", "name", "1.1.2");

defineStatic("Number", "isNaN", "1.2.1", "is-nan");

defineStatic("Object", "assign", "4.1.0");
defineStatic("Object", "entries", "1.1.1");
defineStatic("Object", "fromEntries", "2.0.2");
defineStatic("Object", "getOwnPropertyDescriptors", "2.1.0");
defineStatic("Object", "values", "1.1.1");

defineStatic("Promise", "allSettled", "1.0.2");
defineStatic("Promise", "any", "2.0.1");
defineStatic("Promise", "try", "1.0.0");
defineInstance("Promise", "finally", "1.2.1");

defineStatic("Reflect", "ownKeys", "1.0.1");

defineInstance("RegExp", "flags", "1.3.0");

defineInstance("String", "matchAll", "4.0.2");
defineInstance("String", "padEnd", "1.1.1");
defineInstance("String", "padStart", "3.1.0");
defineInstance("String", "replaceAll", "1.0.3");
defineInstance("String", "trim", "1.2.1");
defineInstance("String", "trimEnd", "1.0.0");
defineInstance("String", "trimLeft", "2.1.1");
defineInstance("String", "trimRight", "2.1.1");
defineInstance("String", "trimStart", "1.0.0");

defineInstance("Symbol", "description", "1.0.2");

function createDescriptor(name, version, pkg = name.toLowerCase()) {
  return { name, version, package: pkg };
}

function defineGlobal(name, version, pkg) {
  Globals[name] = [createDescriptor(name, version, pkg)];
}

function defineStatic(object, property, version, pkg) {
  if (!has(StaticProperties, object)) StaticProperties[object] = {};

  StaticProperties[object][property] = [
    createDescriptor(`${object}.${property}`, version, pkg),
  ];
}

function defineInstance(object, property, version, pkg) {
  if (!has(InstanceProperties, property)) InstanceProperties[property] = [];

  InstanceProperties[property].push({
    ...createDescriptor(`${object}.prototype.${property}`, version, pkg),
    pure: false,
  });
}
