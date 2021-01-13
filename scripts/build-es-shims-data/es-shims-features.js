"use strict";

module.exports = {
  globalThis: "globalThis",
  AggregateError: "Promise.any / AggregateError",
  "Array.from": "Array static methods / Array.from",
  "Array.of": "Array static methods / Array.of",
  "Array.prototype.at": "`.item` method / Array.prototype.item",
  "Array.prototype.copyWithin":
    "Array.prototype methods / Array.prototype.copyWithin",
  "Array.prototype.entries":
    "Array.prototype methods / Array.prototype.entries",
  "Array.prototype.every": "Array methods / Array.prototype.every",
  "Array.prototype.find": "Array.prototype methods / Array.prototype.find",
  "Array.prototype.findIndex":
    "Array.prototype methods / Array.prototype.findIndex",
  "Array.prototype.flat":
    "Array.prototype.{flat, flatMap} / Array.prototype.flat",
  "Array.prototype.flatMap":
    "Array.prototype.{flat, flatMap} / Array.prototype.flatMap",
  "Array.prototype.includes": "Array.prototype.includes",
  "Array.prototype.indexOf": "Array methods / Array.prototype.indexOf",
  "Array.prototype.keys": "Array.prototype methods / Array.prototype.keys",
  "Array.prototype.lastIndexOf": "Array methods / Array.prototype.lastIndexOf",
  "Array.prototype.map": "Array methods / Array.prototype.map",
  "Array.prototype.reduce": "Array methods / Array.prototype.reduce",
  "Array.prototype.reduceRight": "Array methods / Array.prototype.reduceRight",
  "Array.prototype.some": "Array methods / Array.prototype.some",
  "Array.prototype.values": "Array.prototype methods / Array.prototype.values",
  "Function.prototype.name": {
    features: [
      'function "name" property / function statements',
      'function "name" property / function expressions',
    ],
  },
  "Math.acosh": "Math methods / Math.acosh",
  "Math.atanh": "Math methods / Math.atanh",
  "Math.clz32": "Math methods / Math.clz32",
  "Math.cbrt": "Math methods / Math.cbrt",
  "Math.fround": "Math methods / Math.fround",
  "Math.log1p": "Math methods / Math.log1p",
  "Math.sign": "Math methods / Math.sign",
  "Number.isNaN": "Number properties / Number.isNaN",
  "Object.assign": "Object static methods / Object.assign",
  "Object.is": "Object static methods / Object.is",
  "Object.entries": "Object static methods / Object.entries",
  "Object.fromEntries": "Object.fromEntries",
  "Object.getOwnPropertyDescriptors":
    "Object static methods / Object.getOwnPropertyDescriptors",
  "Object.getPrototypeOf": "Object static methods / Object.getPrototypeOf",
  "Object.values": "Object static methods / Object.values",
  "Promise.allSettled": "Promise.allSettled",
  "Promise.any": "Promise.any",
  "Promise.try": [],
  "Promise.prototype.finally": "Promise.prototype.finally",
  "Reflect.getPrototypeOf": "Reflect / Reflect.getPrototypeOf",
  "Reflect.ownKeys": "Reflect / Reflect.ownKeys",
  "RegExp.prototype.flags":
    "RegExp.prototype properties / RegExp.prototype.flags",
  "String.fromCodePoint": "String static methods / String.fromCodePoint",
  "String.raw": "String static methods / String.raw",
  "String.prototype.codePointAt":
    "String.prototype methods / String.prototype.codePointAt",
  "String.prototype.endsWith":
    "String.prototype methods / String.prototype.endsWith",
  "String.prototype.includes":
    "String.prototype methods / String.prototype.includes",
  "String.prototype.at": "`.item` method / String.prototype.item",
  "String.prototype.matchAll": "String.prototype.matchAll",
  "String.prototype.padEnd": "String padding / String.prototype.padEnd",
  "String.prototype.padStart": "String padding / String.prototype.padStart",
  "String.prototype.repeat":
    "String.prototype methods / String.prototype.repeat",
  "String.prototype.replaceAll": "String.prototype.replaceAll",
  "String.prototype.split":
    "String properties and methods / String.prototype.split",
  "String.prototype.startsWith":
    "String.prototype methods / String.prototype.startsWith",
  "String.prototype.trim":
    "String properties and methods / String.prototype.trim",
  "String.prototype.trimEnd": "string trimming / String.prototype.trimEnd",
  "String.prototype.trimLeft": "string trimming / String.prototype.trimLeft",
  "String.prototype.trimRight": "string trimming / String.prototype.trimRight",
  "String.prototype.trimStart": "string trimming / String.prototype.trimStart",
  "Symbol.prototype.description": "Symbol.prototype.description",
};
