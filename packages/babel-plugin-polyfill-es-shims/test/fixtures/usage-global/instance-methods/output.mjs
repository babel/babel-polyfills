import "array.from/auto";
import "array-includes/auto";
import "string.prototype.includes/auto";
import "array.prototype.find/auto";
import "array.prototype.findindex/auto";
import "string.prototype.padstart/auto";
import "string.prototype.padend/auto";
import "string.prototype.startswith/auto";
import "string.prototype.endswith/auto";
import "array.prototype.copywithin/auto";
import "string.prototype.split/auto";
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
