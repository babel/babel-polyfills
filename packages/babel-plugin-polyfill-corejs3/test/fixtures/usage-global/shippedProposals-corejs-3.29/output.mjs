import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.symbol.iterator.js";
import "core-js/modules/es.symbol.match.js";
import "core-js/modules/es.array.from.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.global-this.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.object.create.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.set.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/es.string.match.js";
import "core-js/modules/esnext.set.difference.v2.js";
import "core-js/modules/esnext.set.intersection.v2.js";
import "core-js/modules/esnext.set.is-disjoint-from.v2.js";
import "core-js/modules/esnext.set.is-subset-of.v2.js";
import "core-js/modules/esnext.set.is-superset-of.v2.js";
import "core-js/modules/esnext.set.symmetric-difference.v2.js";
import "core-js/modules/esnext.set.union.v2.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/web.queue-microtask.js";
Array.from; // static method
Map; // built-in
new Promise(); // new builtin
Symbol.match; // as member expression
_arr[Symbol.iterator](); // Symbol.iterator

// no import
Array.asdf;
Array2.from;
Map2;
new Promise2();
Symbol.asdf;
Symbol2.match;
_arr9[Symbol2.iterator]();
_arr9[Symbol.iterator2]();
G.assign; // static method
function H(WeakMap) {
  var blah = new WeakMap();
} // shadowed

const foo = new Promise(resolve => {
  resolve(new Map());
});
queueMicrotask(() => globalThis);
Observable.from(10);
new Set(array).intersection(otherSet);
SyntaxError.isError(a);
