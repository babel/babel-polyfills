// @flow

export type Descriptor = {
  name: string,
  version: string,
  package: string,
  pure?: false,
  global?: false,
};

export const Globals = Object.create(null);
export const StaticProperties = Object.create(null);
export const InstanceProperties = Object.create(null);

defineGlobal("globalThis", "1.0.0", "globalThis");

defineGlobal("AggregateError", "1.0.2", "es-aggregate-error");

defineInstance("Array", "every", "1.1.0");
defineInstance("Array", "flat", "1.2.3");
defineInstance("Array", "flatMap", "1.2.3");
defineInstance("Array", "includes", "3.1.1", "array-includes");
defineInstance("Array", "indexOf", "1.0.0");
defineInstance("Array", "some", "1.1.1");

defineInstance("Function", "name", "1.1.2");

defineStatic("Number", "isNaN", "1.2.1", "is-nan");

defineStatic("Object", "entries", "1.1.1");
defineStatic("Object", "fromEntries", "2.0.2");
defineStatic("Object", "getOwnPropertyDescriptors", "2.1.0");
defineStatic("Object", "values", "1.1.1");

defineStatic("Promise", "any", "2.0.1");
defineStatic("Promise", "try", "1.0.0");
defineInstance("Promise", "finally", "1.2.1");

defineStatic("Reflect", "ownKeys", "1.0.1");

defineInstance("RegExp", "flags", "1.3.0");

defineInstance("String", "padEnd", "1.1.1");
defineInstance("String", "padStart", "3.1.0");
defineInstance("String", "replaceAll", "1.0.3");
defineInstance("String", "trim", "1.2.1");
defineInstance("String", "trimLeft", "2.1.1");
defineInstance("String", "trimRight", "2.1.1");

defineInstance("Symbol", "description", "1.0.2");

function createDescriptor(name, version, pkg = name.toLowerCase()) {
  return { name, version, package: pkg };
}

function defineGlobal(name, version, pkg) {
  Globals[name] = [createDescriptor(name, version, pkg)];
}

function defineStatic(object, property, version, pkg) {
  if (!StaticProperties[object]) StaticProperties[object] = Object.create(null);

  StaticProperties[object][property] = [
    createDescriptor(`${object}.${property}`, version, pkg),
  ];
}

function defineInstance(object, property, version, pkg) {
  if (!InstanceProperties[property]) InstanceProperties[property] = [];

  InstanceProperties[property].push({
    ...createDescriptor(`${object}.prototype.${property}`, version, pkg),
    pure: false,
  });
}
