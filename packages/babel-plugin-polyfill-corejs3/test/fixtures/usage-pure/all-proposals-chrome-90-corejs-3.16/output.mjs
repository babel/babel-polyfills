var _context, _context2, _context3, _context4, _context5, _context6;
import _findLastInstanceProperty from "core-js-pure/features/instance/find-last.js";
import _findLastIndexInstanceProperty from "core-js-pure/features/instance/find-last-index.js";
import _Iterator$from from "core-js-pure/features/iterator/from.js";
import _groupByInstanceProperty from "core-js-pure/features/instance/group-by.js";
import _AsyncIterator$from from "core-js-pure/features/async-iterator/from.js";
import _uniqueByInstanceProperty from "core-js-pure/features/instance/unique-by.js";
import _Number$range from "core-js-pure/features/number/range.js";
import _BigInt$range from "core-js-pure/features/bigint/range.js";
import _Array$isTemplateObject from "core-js-pure/features/array/is-template-object.js";
import _emplaceInstanceProperty from "core-js-pure/features/instance/emplace.js";
import _Symbol$asyncDispose from "core-js-pure/features/symbol/async-dispose.js";
import _Symbol$matcher from "core-js-pure/features/symbol/matcher.js";
import _Symbol$metadata from "core-js-pure/features/symbol/metadata.js";
_findLastInstanceProperty(_context = []).call(_context, fn);
_findLastIndexInstanceProperty(_context2 = []).call(_context2, fn);
[].asIndexedPairs();
_Iterator$from({
  next: () => ({
    done: Math.random() > .9,
    value: Math.random() * 10 | 0
  })
}).forEach(console.log).toArray();
_groupByInstanceProperty(_context3 = _AsyncIterator$from([1, 2, 3, 4, 5, 6, 7]).drop(1).take(5).filter(it => it % 2)).call(_context3, it => id % 4).map(it => it ** 2).toArray().then(console.log);
_groupByInstanceProperty(_context4 = _uniqueByInstanceProperty(_context5 = [1, 2, 3, 4, 5, 6, 7, 7]).call(_context5, x => x)).call(_context4, x => x % 2);
_Number$range(1, 2);
_BigInt$range(1n, 2n);
_Array$isTemplateObject((x => x)`a${x}z`);
_emplaceInstanceProperty(_context6 = new Map([['x', 1]])).call(_context6, 'x', {
  update: x => x + 1,
  insert: () => 0
});
/x/.dotAll;
/x/.sticky;
_Symbol$asyncDispose;
_Symbol$matcher;
Symbol.matchAll;
_Symbol$metadata;
Symbol.replaceAll;
foo.indexed;
bar.with;
buz.push;
