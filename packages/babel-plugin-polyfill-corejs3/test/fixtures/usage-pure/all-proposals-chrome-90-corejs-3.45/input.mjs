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
SuppressedError
DisposableStack;
AsyncDisposableStack;

Iterator.range(foo, bar);
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
Map.groupBy(a, b);
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

Iterator.concat(a, b);
new Map().getOrInsert(a, b);

SyntaxError.isError(a);

Array.fromAsync(a);

Iterator.zip(a, b);
Iterator.zipKeyed(a, b);

a.chunks(b);
a.sliding(b);
a.windows(b);

a.clamp(b, c);
