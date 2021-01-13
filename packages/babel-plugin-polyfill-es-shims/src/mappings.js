// @flow

import { template, types as t } from "@babel/core";

import type { MetaDescriptor } from "@babel/helper-define-polyfill-provider";

const expr = template.expression.ast;

// $FlowIgnore
const has = Function.call.bind(Object.hasOwnProperty);

export type Descriptor = {
  name: string,
  version: string,
  package: string,
  pure?: false,
  global?: false,
  thisCheck?: (thisObj: Object) => Object,
  exclude?: (meta: MetaDescriptor) => boolean,
  getter?: true,
};

export const Globals = {};
export const StaticProperties = {};
export const InstanceProperties = {};

defineGlobal("globalThis", "1.0.0");

defineGlobal("AggregateError", "1.0.2", "es-aggregate-error");

const arrayCheck = thisObj => expr`Array.isArray(${thisObj})`;
const typeofCheck = type => thisObj => expr`typeof ${thisObj} === "${type}"`;
const instanceofCheck = Class => thisObj =>
  expr`${thisObj} instanceof ${t.identifier(Class)}`;
const stringCheck = typeofCheck("string");

const getter = { getter: true };
const excludeStatic = obj => ({
  exclude: meta =>
    meta.kind === "property" &&
    meta.placement === "static" &&
    meta.object === obj,
});
const excludeObject = excludeStatic("Object");

defineStatic("Array", "from", "1.1.0");
defineStatic("Array", "of", "1.0.0");
defineInstance("Array", "copyWithin", "1.0.0", arrayCheck);
defineInstance("Array", "entries", "1.0.0", arrayCheck, excludeObject);
defineInstance("Array", "every", "1.1.0", arrayCheck);
defineInstance("Array", "find", "2.1.1", arrayCheck);
defineInstance("Array", "findIndex", "2.1.0", arrayCheck);
defineInstance("Array", "flat", "1.2.3", arrayCheck);
defineInstance("Array", "flatMap", "1.2.3", arrayCheck);
defineInstance("Array", "includes", "3.1.1", arrayCheck, {
  pkg: "array-includes",
});
defineInstance("Array", "indexOf", "1.0.1", arrayCheck);
defineInstance("Array", "at", "1.0.0", arrayCheck);
defineInstance("Array", "keys", "1.0.0", arrayCheck, excludeObject);
defineInstance("Array", "lastIndexOf", "1.0.0", arrayCheck);
defineInstance("Array", "map", "1.0.2", arrayCheck);
defineInstance("Array", "reduce", "1.0.1", arrayCheck);
defineInstance("Array", "reduceRight", "1.0.1", arrayCheck);
defineInstance("Array", "some", "1.1.1", arrayCheck);
defineInstance("Array", "values", "1.0.0", arrayCheck, excludeObject);

defineInstance("Function", "name", "1.1.2", typeofCheck("function"), getter);

defineStatic("Math", "acosh", "1.0.0");
defineStatic("Math", "atanh", "1.0.0");
defineStatic("Math", "clz32", "1.0.0");
defineStatic("Math", "cbrt", "1.0.0");
defineStatic("Math", "fround", "1.0.0");
defineStatic("Math", "log1p", "1.0.1");
defineStatic("Math", "sign", "2.0.0");

defineStatic("Number", "isNaN", "1.2.1", "is-nan");

defineStatic("Object", "assign", "4.1.0");
defineStatic("Object", "entries", "1.1.1");
defineStatic("Object", "fromEntries", "2.0.2");
defineStatic("Object", "is", "1.1.2", "object-is");
defineStatic("Object", "getOwnPropertyDescriptors", "2.1.0");
defineStatic("Object", "getPrototypeOf", "1.0.0");
defineStatic("Object", "values", "1.1.1");

defineStatic("Promise", "allSettled", "1.0.2");
defineStatic("Promise", "any", "2.0.1");
defineStatic("Promise", "try", "1.0.0");
defineInstance("Promise", "finally", "1.2.1", instanceofCheck("Promise"));

defineStatic("Reflect", "ownKeys", "1.0.1");
defineStatic("Reflect", "getPrototypeOf", "1.0.0");

defineInstance("RegExp", "flags", "1.3.0", instanceofCheck("RegExp"), getter);

defineStatic("String", "fromCodePoint", "1.0.0");
defineStatic("String", "raw", "1.0.1");
defineInstance("String", "codePoitAt", "1.0.0", stringCheck);
defineInstance("String", "endsWith", "1.0.0", stringCheck);
defineInstance("String", "includes", "2.0.0", stringCheck);
defineInstance("String", "at", "1.0.0", stringCheck);
defineInstance("String", "matchAll", "4.0.2", stringCheck);
defineInstance("String", "padEnd", "1.1.1", stringCheck);
defineInstance("String", "padStart", "3.1.0", stringCheck);
defineInstance("String", "repeat", "1.0.0", stringCheck);
defineInstance("String", "replaceAll", "1.0.3", stringCheck);
defineInstance(
  "String",
  "split",
  "1.0.1",
  stringCheck,
  excludeStatic("Symbol"),
);
defineInstance("String", "startsWith", "1.0.0", stringCheck);
defineInstance("String", "trim", "1.2.1", stringCheck);
defineInstance("String", "trimEnd", "1.0.0", stringCheck);
defineInstance("String", "trimLeft", "2.1.1", stringCheck);
defineInstance("String", "trimRight", "2.1.1", stringCheck);
defineInstance("String", "trimStart", "1.0.0", stringCheck);

defineInstance(
  "Symbol",
  "description",
  "1.0.2",
  instanceofCheck("Symbol"),
  getter,
);

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

function defineInstance(
  object,
  property,
  version,
  thisCheck,
  {
    getter = false,
    exclude,
    pkg,
  }: {
    getter?: boolean,
    exclude?: (meta: MetaDescriptor) => boolean,
    pkg?: string,
  } = {},
) {
  if (!has(InstanceProperties, property)) InstanceProperties[property] = [];

  InstanceProperties[property].push({
    ...createDescriptor(`${object}.prototype.${property}`, version, pkg),
    thisCheck,
    exclude,
    getter,
  });
}
