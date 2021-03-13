import assert from "assert/strict";
import { transformSync } from "@babel/core";

import corejs2 from "babel-plugin-polyfill-corejs2";
import corejs3 from "babel-plugin-polyfill-corejs3";
import esShims from "babel-plugin-polyfill-es-shims";
import regenerator from "babel-plugin-polyfill-regenerator";

assert.equal(typeof corejs2, "function");
assert.equal(typeof corejs3, "function");
assert.equal(typeof esShims, "function");
assert.equal(typeof regenerator, "function");

function transform(plugin, code = "Array.from(it)") {
  return transformSync(code, {
    configFile: false,
    browserslistConfigFile: false,
    plugins: [[plugin, { method: "usage-global" }]],
  }).code;
}

assert.equal(
  transform(corejs2),
  `
import "core-js/modules/es6.symbol.js";
import "core-js/modules/es6.array.from.js";
import "core-js/modules/es6.string.iterator.js";
import "core-js/modules/es6.object.to-string.js";
import "core-js/modules/es6.array.iterator.js";
import "core-js/modules/web.dom.iterable.js";
Array.from(it);
	`.trim()
);

assert.equal(
  transform(corejs3),
  `
import "core-js/modules/es.array.from.js";
import "core-js/modules/es.string.iterator.js";
Array.from(it);
  `.trim()
);

assert.equal(
  transform(esShims),
  `
import "array.from/auto";
Array.from(it);
	`.trim()
);

assert.equal(
  transform(regenerator, "regeneratorRuntime.mark(fn)"),
  `
import "regenerator-runtime/runtime.js";
regeneratorRuntime.mark(fn);
	`.trim()
);

console.log("OK!");
