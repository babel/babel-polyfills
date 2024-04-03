var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11;
import _findLastInstanceProperty from "core-js-pure/features/instance/find-last.js";
import _findLastIndexInstanceProperty from "core-js-pure/features/instance/find-last-index.js";
import _forEachInstanceProperty from "core-js-pure/features/instance/for-each.js";
import _Iterator$from from "core-js-pure/features/iterator/from.js";
import _mapInstanceProperty from "core-js-pure/features/instance/map.js";
import _groupByInstanceProperty from "core-js-pure/features/instance/group-by.js";
import _filterInstanceProperty from "core-js-pure/features/instance/filter.js";
import _AsyncIterator$from from "core-js-pure/features/async-iterator/from.js";
import _uniqueByInstanceProperty from "core-js-pure/features/instance/unique-by.js";
import _Number$range from "core-js-pure/features/number/range.js";
import _BigInt$range from "core-js-pure/features/bigint/range.js";
import _Array$isTemplateObject from "core-js-pure/features/array/is-template-object.js";
import _emplaceInstanceProperty from "core-js-pure/features/instance/emplace.js";
import _Map from "core-js-pure/features/map/index.js";
import _Symbol$asyncDispose from "core-js-pure/features/symbol/async-dispose.js";
import _Symbol$matcher from "core-js-pure/features/symbol/matcher.js";
import _Symbol$matchAll from "core-js-pure/features/symbol/match-all.js";
import _Symbol$metadata from "core-js-pure/features/symbol/metadata.js";
import _replaceAllInstanceProperty from "core-js-pure/features/instance/replace-all.js";
import _Symbol from "core-js-pure/features/symbol/index.js";
import _URL from "core-js-pure/features/url/index.js";
import _groupByToMapInstanceProperty from "core-js-pure/features/instance/group-by-to-map.js";
import _unThisInstanceProperty from "core-js-pure/features/instance/un-this.js";
import _Function$isConstructor from "core-js-pure/features/function/is-constructor.js";
import _DOMException from "core-js-pure/features/dom-exception/index.js";
import _structuredClone from "core-js-pure/features/structured-clone.js";
import _withInstanceProperty from "core-js-pure/features/instance/with.js";
_findLastInstanceProperty(_context = []).call(_context, fn);
_findLastIndexInstanceProperty(_context2 = []).call(_context2, fn);
[].asIndexedPairs();
_forEachInstanceProperty(_context3 = _Iterator$from({
  next: () => ({
    done: Math.random() > .9,
    value: Math.random() * 10 | 0
  })
})).call(_context3, console.log).toArray();
_mapInstanceProperty(_context4 = _groupByInstanceProperty(_context5 = _filterInstanceProperty(_context6 = _AsyncIterator$from([1, 2, 3, 4, 5, 6, 7]).drop(1).take(5)).call(_context6, it => it % 2)).call(_context5, it => id % 4)).call(_context4, it => it ** 2).toArray().then(console.log);
_groupByInstanceProperty(_context7 = _uniqueByInstanceProperty(_context8 = [1, 2, 3, 4, 5, 6, 7, 7]).call(_context8, x => x)).call(_context7, x => x % 2);
_Number$range(1, 2);
_BigInt$range(1n, 2n);
_Array$isTemplateObject((x => x)`a${x}z`);
_emplaceInstanceProperty(_context9 = new _Map([['x', 1]])).call(_context9, 'x', {
  update: x => x + 1,
  insert: () => 0
});
/x/.dotAll;
/x/.sticky;
_Symbol$asyncDispose;
_Symbol$matcher;
_Symbol$matchAll;
_Symbol$metadata;
_replaceAllInstanceProperty(_Symbol);
new _URL(url);
const foo = _groupByToMapInstanceProperty(_context10 = [1, 2, 3]).call(_context10, bar);
const push = _unThisInstanceProperty(_context11 = [].push).call(_context11);
_Function$isConstructor;
throw new _DOMException();
_structuredClone(72);
foo.indexed;
_withInstanceProperty(bar);
buz.push;
