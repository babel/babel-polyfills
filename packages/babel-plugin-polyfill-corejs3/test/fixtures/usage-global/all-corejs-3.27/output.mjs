import "core-js/modules/es.symbol.js";
import "core-js/modules/es.symbol.description.js";
import "core-js/modules/es.symbol.match-all.js";
import "core-js/modules/es.error.cause.js";
import "core-js/modules/es.error.to-string.js";
import "core-js/modules/es.array.filter.js";
import "core-js/modules/es.array.find-last.js";
import "core-js/modules/es.array.find-last-index.js";
import "core-js/modules/es.array.for-each.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.array.map.js";
import "core-js/modules/es.array.push.js";
import "core-js/modules/es.map.js";
import "core-js/modules/es.number.constructor.js";
import "core-js/modules/es.object.create.js";
import "core-js/modules/es.object.freeze.js";
import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.object.proto.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.regexp.dot-all.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.regexp.sticky.js";
import "core-js/modules/es.set.js";
import "core-js/modules/es.string.from-code-point.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/es.string.match-all.js";
import "core-js/modules/es.string.replace.js";
import "core-js/modules/es.string.replace-all.js";
import "core-js/modules/es.weak-map.js";
import "core-js/modules/esnext.array.with.js";
import "core-js/modules/esnext.string.is-well-formed.js";
import "core-js/modules/esnext.string.to-well-formed.js";
import "core-js/modules/web.btoa.js";
import "core-js/modules/web.dom-collections.for-each.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/web.dom-exception.constructor.js";
import "core-js/modules/web.dom-exception.stack.js";
import "core-js/modules/web.dom-exception.to-string-tag.js";
import "core-js/modules/web.self.js";
import "core-js/modules/web.structured-clone.js";
import "core-js/modules/web.url.js";
import "core-js/modules/web.url-search-params.js";
[].findLast(fn);
[].findLastIndex(fn);
[].asIndexedPairs();
Iterator.from({
  next: () => ({
    done: Math.random() > .9,
    value: Math.random() * 10 | 0
  })
}).forEach(console.log).toArray();
AsyncIterator.from([1, 2, 3, 4, 5, 6, 7]).drop(1).take(5).filter(it => it % 2).groupBy(it => id % 4).map(it => it ** 2).toArray().then(console.log);
[1, 2, 3, 4, 5, 6, 7, 7].uniqueBy(x => x).groupBy(x => x % 2);
Number.range(1, 2);
BigInt.range(1n, 2n);
Array.isTemplateObject((x => x)`a${x}z`);
new Map([['x', 1]]).emplace('x', {
  update: x => x + 1,
  insert: () => 0
});
/x/.dotAll;
/x/.sticky;
Symbol.asyncDispose;
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
Iterator.range(foo, bar);
JSON.parse(foo);
JSON.isRawJSON(foo);
JSON.rawJSON(foo);
Symbol.isWellKnown(foo);
Symbol.isRegistered(foo);
Function.demethodize();
