import "core-js/modules/es.array.find-last.js";
import "core-js/modules/es.array.find-last-index.js";
import "core-js/modules/esnext.async-iterator.constructor.js";
import "core-js/modules/esnext.async-iterator.to-array.js";
import "core-js/modules/esnext.iterator.constructor.js";
import "core-js/modules/esnext.iterator.to-array.js";
import "core-js/modules/esnext.async-iterator.for-each.js";
import "core-js/modules/esnext.iterator.for-each.js";
import "core-js/modules/esnext.iterator.from.js";
import "core-js/modules/esnext.async-iterator.map.js";
import "core-js/modules/esnext.iterator.map.js";
import "core-js/modules/esnext.array.group-by.js";
import "core-js/modules/esnext.async-iterator.filter.js";
import "core-js/modules/esnext.iterator.filter.js";
import "core-js/modules/esnext.async-iterator.take.js";
import "core-js/modules/esnext.iterator.take.js";
import "core-js/modules/esnext.async-iterator.drop.js";
import "core-js/modules/esnext.iterator.drop.js";
import "core-js/modules/esnext.async-iterator.every.js";
import "core-js/modules/esnext.async-iterator.find.js";
import "core-js/modules/esnext.async-iterator.flat-map.js";
import "core-js/modules/esnext.async-iterator.from.js";
import "core-js/modules/esnext.async-iterator.reduce.js";
import "core-js/modules/esnext.async-iterator.some.js";
import "core-js/modules/esnext.array.unique-by.js";
import "core-js/modules/esnext.number.range.js";
import "core-js/modules/esnext.bigint.range.js";
import "core-js/modules/esnext.array.is-template-object.js";
import "core-js/modules/esnext.map.emplace.js";
import "core-js/modules/esnext.weak-map.emplace.js";
import "core-js/modules/esnext.map.delete-all.js";
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
import "core-js/modules/esnext.symbol.async-dispose.js";
import "core-js/modules/esnext.symbol.matcher.js";
import "core-js/modules/esnext.symbol.metadata.js";
import "core-js/modules/esnext.async-iterator.indexed.js";
import "core-js/modules/esnext.iterator.indexed.js";
import "core-js/modules/esnext.array.with.js";
import "core-js/modules/es.array.push.js";
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
foo.indexed;
bar.with;
buz.push;
