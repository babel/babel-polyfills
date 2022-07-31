[].findLast(fn);
[].findLastIndex(fn);

[].asIndexedPairs();

Iterator.from({
    next: () => ({ done: Math.random() > .9, value: Math.random() * 10 | 0 })
  }).forEach(console.log).toArray();

AsyncIterator.from([1, 2, 3, 4, 5, 6, 7])
  .drop(1)
  .take(5)
  .filter(it => it % 2)
  .groupBy(it => id % 4)
  .map(it => it ** 2)
  .toArray()
  .then(console.log);

[1, 2, 3, 4, 5, 6, 7, 7].uniqueBy(x => x).groupBy(x => x % 2);

Number.range(1, 2);
BigInt.range(1n, 2n);

Array.isTemplateObject((x => x)`a${ x }z`)

new Map([['x', 1]]).emplace('x', { update: x => x + 1, insert: () => 0});

/x/.dotAll;
/x/.sticky

Symbol.asyncDispose
Symbol.matcher
Symbol.matchAll
Symbol.metadata
Symbol.replaceAll

foo.indexed;
bar.with;
buz.push;
