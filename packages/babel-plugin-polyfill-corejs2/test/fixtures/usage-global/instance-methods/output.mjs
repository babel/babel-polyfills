import "core-js/modules/es6.symbol.js";
import "core-js/modules/es6.array.from.js";
import "core-js/modules/es6.string.iterator.js";
import "core-js/modules/es6.object.to-string.js";
import "core-js/modules/es6.array.iterator.js";
import "core-js/modules/web.dom.iterable.js";
import "core-js/modules/es6.map.js";
import "core-js/modules/es6.string.includes.js";
import "core-js/modules/es7.array.includes.js";
import "core-js/modules/es6.array.find.js";
import "core-js/modules/es6.array.find-index.js";
import "core-js/modules/es6.function.bind.js";
import "core-js/modules/es6.array.fill.js";
import "core-js/modules/es7.string.pad-start.js";
import "core-js/modules/es7.string.pad-end.js";
import "core-js/modules/es6.string.starts-with.js";
import "core-js/modules/es6.string.code-point-at.js";
import "core-js/modules/es6.string.ends-with.js";
import "core-js/modules/es6.array.copy-within.js";
import "core-js/modules/es6.regexp.search.js";
import "core-js/modules/es6.regexp.replace.js";
import "core-js/modules/es6.regexp.split.js";
Array.from; // static function

Map; // top level built-in
// instance methods may have false positives (which is ok)

a.includes(); // method call

b['find']; // computed string?

Array.prototype.findIndex(); // .prototype

d.fill.bind(); //.bind

e.padStart.apply(); // .apply

f.padEnd.call(); // .call

String.prototype.startsWith.call; // prototype.call

var {
  codePointAt,
  endsWith
} = k; // destructuring

var asdf = "copyWithin";
var asdf2 = "split";
var asdf3 = "re" + "place";
i[asdf]; // computed with identifier

j[`search`]; // computed with template

k[asdf3]; // computed with concat strings

var {
  [asdf2]: _a
} = k; // computed
