import "core-js/modules/es.array.from.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/esnext.map.delete-all.js";
import "core-js/modules/esnext.map.emplace.js";
import "core-js/modules/esnext.map.every.js";
import "core-js/modules/esnext.map.filter.js";
import "core-js/modules/esnext.map.find.js";
import "core-js/modules/esnext.map.find-key.js";
import "core-js/modules/esnext.map.includes.js";
import "core-js/modules/esnext.map.key-of.js";
import "core-js/modules/esnext.map.map-keys.js";
import "core-js/modules/esnext.map.map-values.js";
import "core-js/modules/esnext.map.merge.js";
import "core-js/modules/esnext.map.reduce.js";
import "core-js/modules/esnext.map.some.js";
import "core-js/modules/esnext.map.update.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.symbol.match.js";
import "core-js/modules/es.string.match.js";
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.symbol.iterator.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/web.queue-microtask.js";
import "core-js/modules/es.global-this.js";
import "core-js/modules/esnext.observable.js";
import "core-js/modules/esnext.symbol.observable.js";
import "core-js/modules/es.error.cause.js";
import "core-js/modules/es.error.to-string.js";
import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.set.js";
import "core-js/modules/web.dom-exception.constructor.js";
import "core-js/modules/web.dom-exception.stack.js";
import "core-js/modules/web.dom-exception.to-string-tag.js";
import "core-js/modules/web.structured-clone.js";
import "core-js/modules/esnext.array.group-by-to-map.js";
import "core-js/modules/esnext.async-iterator.constructor.js";
import "core-js/modules/esnext.iterator.constructor.js";
import "core-js/modules/esnext.array.with.js";
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
Observable.from(10); // new

new EvalError(1, {
  cause: 2
});
structuredClone;
[].groupByToMap;
foo.indexed;
bar.with;
buz.push;
