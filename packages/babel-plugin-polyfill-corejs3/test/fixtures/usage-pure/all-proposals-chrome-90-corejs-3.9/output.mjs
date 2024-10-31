var _context, _context2, _context3;
import _findLastInstanceProperty from "core-js-pure/features/instance/find-last.js";
import _findLastIndexInstanceProperty from "core-js-pure/features/instance/find-last-index.js";
import _Iterator$from from "core-js-pure/features/iterator/from.js";
import _AsyncIterator$from from "core-js-pure/features/async-iterator/from.js";
import _uniqueByInstanceProperty from "core-js-pure/features/instance/unique-by.js";
import _Number$range from "core-js-pure/features/number/range.js";
import _BigInt$range from "core-js-pure/features/bigint/range.js";
import _Array$isTemplateObject from "core-js-pure/features/array/is-template-object.js";
import _Symbol$asyncDispose from "core-js-pure/features/symbol/async-dispose.js";
import _Iterator from "core-js-pure/features/iterator/index.js";
import _Map$groupBy from "core-js-pure/features/map/group-by.js";
_findLastInstanceProperty(_context = []).call(_context, fn);
_findLastIndexInstanceProperty(_context2 = []).call(_context2, fn);
[].asIndexedPairs();
_Iterator$from({
  next: () => ({
    done: Math.random() > .9,
    value: Math.random() * 10 | 0
  })
}).forEach(console.log).toArray();
_AsyncIterator$from([1, 2, 3, 4, 5, 6, 7]).drop(1).take(5).filter(it => it % 2).groupBy(it => id % 4).map(it => it ** 2).toArray().then(console.log);
_uniqueByInstanceProperty(_context3 = [1, 2, 3, 4, 5, 6, 7, 7]).call(_context3, x => x).groupBy(x => x % 2);
_Number$range(1, 2);
_BigInt$range(1n, 2n);
_Array$isTemplateObject((x => x)`a${x}z`);
new Map([['x', 1]]).emplace('x', {
  update: x => x + 1,
  insert: () => 0
});
/x/.dotAll;
/x/.sticky;
_Symbol$asyncDispose;
Symbol.matcher;
Symbol.matchAll;
Symbol.metadata;
Symbol.replaceAll;
new URL(url);
const foo = [1, 2, 3].groupByToMap(bar);
const push = [].push.unThis();
Function.isConstructor;
throw new DOMException();
structuredClone(72);
btoa('hi');
foo.indexed;
bar.with;
buz.push;
fuz.__proto__;
string.isWellFormed;
string.toWellFormed;
String.dedent`42`;
self;
SuppressedError;
DisposableStack;
AsyncDisposableStack;
_Iterator.range(foo, bar);
JSON.parse(foo);
JSON.isRawJSON(foo);
JSON.rawJSON(foo);
Symbol.isWellKnown(foo);
Symbol.isRegistered(foo);
Function.demethodize();
new URLSearchParams(string).size;
new Set(array).intersection(otherSet);
URL.canParse(foo);
Symbol.isWellKnownSymbol(foo);
Symbol.isRegisteredSymbol(foo);
Symbol.metadata;
Object.groupBy(a, b);
_Map$groupBy(a, b);
Promise.withResolvers();
new URLSearchParams().has(a, b);
Math.f16round(foo);
foo.getFloat16(0);
foo.setFloat16(0, 1);
foo.getUint8Clamped(0);
foo.setUint8Clamped(0, 1);
RegExp.escape(foo);
Uint8Array.fromBase64(string);
Uint8Array.fromHex(string);
new Uint8Array(foo).setFromBase64(string);
new Uint8Array(foo).setFromHex(string);
new Uint8Array(foo).toBase64();
new Uint8Array(foo).toHex();
URL.parse(x);
Math.sumPrecise(x);
Symbol.customMatcher;
_Iterator.concat(a, b);
new Map().getOrInsert(a, b);
