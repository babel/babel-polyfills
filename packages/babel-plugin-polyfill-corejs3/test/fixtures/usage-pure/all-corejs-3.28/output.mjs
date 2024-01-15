var _context, _context2, _context3, _context4, _context5;
import _Symbol from "core-js-pure/stable/symbol/index.js";
import _Symbol$matchAll from "core-js-pure/stable/symbol/match-all.js";
import _filterInstanceProperty from "core-js-pure/stable/instance/filter.js";
import _findLastInstanceProperty from "core-js-pure/stable/instance/find-last.js";
import _findLastIndexInstanceProperty from "core-js-pure/stable/instance/find-last-index.js";
import _forEachInstanceProperty from "core-js-pure/stable/instance/for-each.js";
import _mapInstanceProperty from "core-js-pure/stable/instance/map.js";
import _pushInstanceProperty from "core-js-pure/stable/instance/push.js";
import _withInstanceProperty from "core-js-pure/stable/instance/with.js";
import _Map from "core-js-pure/stable/map/index.js";
import _isWellFormedInstanceProperty from "core-js-pure/features/instance/is-well-formed.js";
import _replaceAllInstanceProperty from "core-js-pure/stable/instance/replace-all.js";
import _toWellFormedInstanceProperty from "core-js-pure/features/instance/to-well-formed.js";
import _btoa from "core-js-pure/stable/btoa.js";
import _DOMException from "core-js-pure/stable/dom-exception/index.js";
import _self from "core-js-pure/stable/self.js";
import _structuredClone from "core-js-pure/stable/structured-clone.js";
import _URL from "core-js-pure/stable/url/index.js";
_findLastInstanceProperty(_context = []).call(_context, fn);
_findLastIndexInstanceProperty(_context2 = []).call(_context2, fn);
[].asIndexedPairs();
_forEachInstanceProperty(_context3 = Iterator.from({
  next: () => ({
    done: Math.random() > .9,
    value: Math.random() * 10 | 0
  })
})).call(_context3, console.log).toArray();
_mapInstanceProperty(_context4 = _filterInstanceProperty(_context5 = AsyncIterator.from([1, 2, 3, 4, 5, 6, 7]).drop(1).take(5)).call(_context5, it => it % 2).groupBy(it => id % 4)).call(_context4, it => it ** 2).toArray().then(console.log);
[1, 2, 3, 4, 5, 6, 7, 7].uniqueBy(x => x).groupBy(x => x % 2);
Number.range(1, 2);
BigInt.range(1n, 2n);
Array.isTemplateObject((x => x)`a${x}z`);
new _Map([['x', 1]]).emplace('x', {
  update: x => x + 1,
  insert: () => 0
});
/x/.dotAll;
/x/.sticky;
_Symbol.asyncDispose;
_Symbol.matcher;
_Symbol$matchAll;
_Symbol.metadata;
_replaceAllInstanceProperty(_Symbol);
new _URL(url);
const foo = [1, 2, 3].groupByToMap(bar);
const push = _pushInstanceProperty([]).unThis();
Function.isConstructor;
throw new _DOMException();
_structuredClone(72);
_btoa('hi');
foo.indexed;
_withInstanceProperty(bar);
_pushInstanceProperty(buz);
fuz.__proto__;
_isWellFormedInstanceProperty(string);
_toWellFormedInstanceProperty(string);
String.dedent`42`;
_self;
SuppressedError;
DisposableStack;
AsyncDisposableStack;
Iterator.range(foo, bar);
JSON.parse(foo);
JSON.isRawJSON(foo);
JSON.rawJSON(foo);
_Symbol.isWellKnown(foo);
_Symbol.isRegistered(foo);
Function.demethodize();
_URL.canParse(foo);
