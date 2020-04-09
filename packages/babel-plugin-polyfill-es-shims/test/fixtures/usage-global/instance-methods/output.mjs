import "array.from/auto.js";
import "array-includes/auto.js";
import "array.prototype.find/auto.js";
import "array.prototype.findindex/auto.js";
import "string.prototype.padstart/auto.js";
import "string.prototype.padend/auto.js";
Array.from; // static function

Map; // top level built-in
// instance methods may have false positives (which is ok)

a.includes(); // method call

b['find']; // computed string?

c.prototype.findIndex(); // .prototype

d.fill.bind(); //.bind

e.padStart.apply(); // .apply

f.padEnd.call(); // .call

String.prototype.startsWith.call; // prototype.call

var {
  codePointAt,
  endsWith
} = k; // destructuring

g.reverse();
var asdf = "copyWithin";
var asdf2 = "split";
var asdf3 = "re" + "place";
i[asdf]; // computed with identifier

j[`search`]; // computed with template

k[asdf3]; // computed with concat strings

var {
  [asdf2]: _a
} = k; // computed
