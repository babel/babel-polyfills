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

defineStatic("Number", "isNaN", "1.2.1", "is-nan");

defineStatic("Object", "getOwnPropertyDescriptors", "2.1.0");
defineStatic("Object", "entries", "1.1.1");
defineStatic("Object", "values", "1.1.1");

defineStatic("Promise", "any", "2.0.1");
defineStatic("Promise", "try", "1.0.0");
defineInstance("Promise", "finally", "1.2.1");

defineInstance("Array", "includes", "3.1.1");
defineInstance("Array", "every", "1.1.0");
defineInstance("Array", "some", "1.1.1");

defineInstance("Function", "name", "1.1.2");

defineInstance("String", "padEnd", "1.1.1");
defineInstance("String", "trim", "1.2.1");
defineInstance("String", "trimLeft", "2.1.1");

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
