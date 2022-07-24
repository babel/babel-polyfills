import { types as t, template } from "@babel/core";
import type { NodePath } from "@babel/traverse";
import type { MetaDescriptor } from "@babel/helper-define-polyfill-provider";

const expr = template.expression.ast;

const has = Function.call.bind(Object.hasOwnProperty);

export type Descriptor = {
  name: string;
  version: string;
  package: string;
  path: string; // This is different from .package for multi-entry-point packages,
  pure?: false;
  global?: false;
  thisCheck?: (thisObj: any) => any;
  exclude?: (meta: MetaDescriptor, path: NodePath) => boolean;
  getter?: true;
};

export const Globals = {};
export const StaticProperties = {};
export const InstanceProperties = {};

const lessThanArgs = num => (meta, path: NodePath) => {
  const { node, parent } = path;
  if (!t.isNewExpression(parent, { callee: node })) return false;
  if (parent.arguments.length >= num) return false;
  return parent.arguments.every(arg => !t.isSpreadElement(arg));
};

for (const [name, causeArgNum] of [
  ["Error", 2],
  ["AggregateError", 3],
  ["EvalError", 2],
  ["RangeError", 2],
  ["ReferenceError", 2],
  ["SyntaxError", 2],
  ["TypeError", 2],
  ["URIError", 2],
] as [string, number][]) {
  defineGlobal(name, "1.0.1", "error-cause", {
    exclude: lessThanArgs(causeArgNum),
    subfolder: name,
    polyfillName: "Error cause",
  });
}
// This needs to come after the AggregateError cause polyfill, since this
// one polyfills less features.
defineGlobal("AggregateError", "1.0.2", "es-aggregate-error");
const DATE_VERSION = "2.0.0";
// MISSING DATA: defineGlobal("Date", DATE_VERSION, "date", { subfolder: "Date" });
defineGlobal("globalThis", "1.0.0");
defineGlobal("parseInt", "2.0.0");

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
defineInstance("Array", "at", "1.0.0", arrayCheck);
defineInstance("Array", "concat", "1.0.2", arrayCheck);
defineInstance("Array", "copyWithin", "1.0.0", arrayCheck);
defineInstance("Array", "entries", "1.0.0", arrayCheck, excludeObject);
defineInstance("Array", "every", "1.1.0", arrayCheck);
defineInstance("Array", "filter", "1.0.0", arrayCheck);
defineInstance("Array", "find", "2.1.1", arrayCheck);
defineInstance("Array", "findIndex", "2.1.0", arrayCheck);
defineInstance("Array", "findLast", "1.0.0", arrayCheck);
defineInstance("Array", "findLastIndex", "1.0.0", arrayCheck);
defineInstance("Array", "flat", "1.2.3", arrayCheck);
defineInstance("Array", "flatMap", "1.2.3", arrayCheck);
defineInstance("Array", "includes", "3.1.1", arrayCheck, {
  pkg: "array-includes",
});
defineInstance("Array", "indexOf", "1.0.1", arrayCheck);
// MISSING DATA: defineInstance("Array", "join", "1.0.0", arrayCheck);
defineInstance("Array", "keys", "1.0.0", arrayCheck, excludeObject);
defineInstance("Array", "lastIndexOf", "1.0.0", arrayCheck);
defineInstance("Array", "map", "1.0.2", arrayCheck);
defineInstance("Array", "reduce", "1.0.1", arrayCheck);
defineInstance("Array", "reduceRight", "1.0.1", arrayCheck);
// MISSING DATA: defineInstance("Array", "slice", "1.0.0", arrayCheck);
defineInstance("Array", "some", "1.1.1", arrayCheck);
defineInstance("Array", "splice", "1.0.1", arrayCheck);
defineInstance("Array", "toReversed", "1.0.1", arrayCheck);
defineInstance("Array", "toSorted", "1.0.0", arrayCheck);
defineInstance("Array", "toSpliced", "1.0.0", arrayCheck);
defineInstance("Array", "unshift", "1.0.0", arrayCheck);
defineInstance("Array", "values", "1.0.0", arrayCheck, excludeObject);
defineInstance("Array", "with", "1.0.1", arrayCheck);

for (const name of [
  "now",
  // MISSING DATA: "parse"
]) {
  defineStatic("Date", name, DATE_VERSION, {
    pkg: "date",
    subfolder: `Date.${name}`,
  });
}
for (const name of [
  // MISSING DATA: "getFullYear",
  // MISSING DATA: "getMonth",
  // MISSING DATA: "getDate",
  // MISSING DATA: "getUTCDate",
  // MISSING DATA: "getUTCFullYear",
  // MISSING DATA: "getUTCMonth",
  // MISSING DATA: "toUTCString",
  // MISSING DATA: "toDateString",
  // MISSING DATA: "toString",
  "toISOString",
  "toJSON",
]) {
  defineInstance("Date", name, DATE_VERSION, instanceofCheck("Date"), {
    pkg: "date",
    subfolder: `Date.prototype.${name}`,
  });
}

defineInstance("Function", "name", "1.1.2", typeofCheck("function"), getter);

defineStatic("Math", "acosh", "1.0.0");
defineStatic("Math", "atanh", "1.0.0");
defineStatic("Math", "clz32", "1.0.0");
defineStatic("Math", "cbrt", "1.0.0");
defineStatic("Math", "fround", "1.0.0");
defineStatic("Math", "log1p", "1.0.1");
defineStatic("Math", "sign", "2.0.0");

defineStatic("Number", "isFinite", "1.0.0");
defineStatic("Number", "isInteger", "1.0.0");
defineStatic("Number", "isSafeInteger", "1.0.0");
defineStatic("Number", "isNaN", "1.0.0", { pkg: "number.isnan" });
defineStatic("Number", "parseFloat", "1.0.0");
defineStatic("Number", "parseInt", "1.0.0");

defineStatic("Object", "assign", "4.1.0");
defineStatic("Object", "defineProperties", "1.0.0");
defineStatic("Object", "entries", "1.1.1");
defineStatic("Object", "fromEntries", "2.0.2");
defineStatic("Object", "hasOwn", "1.0.0");
defineStatic("Object", "is", "1.1.2", { pkg: "object-is" });
defineStatic("Object", "getOwnPropertyDescriptors", "2.1.0");
defineStatic("Object", "getPrototypeOf", "1.0.1");
defineStatic("Object", "values", "1.1.1");

defineStatic("Promise", "allSettled", "1.0.2");
defineStatic("Promise", "any", "2.0.1");
defineStatic("Promise", "try", "1.0.0");
defineInstance("Promise", "finally", "1.2.1", instanceofCheck("Promise"));

defineStatic("Reflect", "apply", "1.0.0");
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
defineInstance("String", "substr", "1.0.0", stringCheck);
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

// Annex B
for (const name of [
  "anchor",
  "big",
  "blink",
  "bold",
  "fixed",
  "fontcolor",
  "fontsize",
  "italics",
  "link",
  "small",
  "strike",
  "sub",
  "sup",
]) {
  defineInstance("String", name, "1.0.0", stringCheck, {
    pkg: `es-string-html-methods`,
    subfolder: name,
  });
}

function createDescriptor(name, version, pkg = name.toLowerCase(), subfolder?) {
  return {
    name,
    version,
    package: pkg,
    path: subfolder ? `${pkg}/${subfolder}` : pkg,
  };
}

type ExcludeFilter = (meta: MetaDescriptor, path: NodePath) => boolean;

function defineGlobal(
  name,
  version,
  pkg?,
  {
    exclude,
    subfolder,
    polyfillName = name,
  }: {
    exclude?: ExcludeFilter;
    subfolder?: string;
    polyfillName?: string;
  } = {},
) {
  if (!has(Globals, name)) Globals[name] = [];
  Globals[name].push({
    ...createDescriptor(polyfillName, version, pkg, subfolder),
    exclude,
    nameHint: name,
  });
}

function defineStatic(
  object,
  property,
  version,
  { pkg, subfolder }: { pkg?: string; subfolder?: string } = {},
) {
  if (!has(StaticProperties, object)) StaticProperties[object] = {};

  StaticProperties[object][property] = [
    createDescriptor(`${object}.${property}`, version, pkg, subfolder),
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
    subfolder,
  }: {
    getter?: boolean;
    exclude?: ExcludeFilter;
    pkg?: string;
    subfolder?: string;
  } = {},
) {
  if (!has(InstanceProperties, property)) InstanceProperties[property] = [];

  InstanceProperties[property].push({
    ...createDescriptor(
      `${object}.prototype.${property}`,
      version,
      pkg,
      subfolder,
    ),
    thisCheck,
    exclude,
    getter,
  });
}
