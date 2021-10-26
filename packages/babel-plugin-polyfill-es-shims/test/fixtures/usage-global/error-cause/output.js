require("error-cause/Error/auto");

require("error-cause/EvalError/auto");

require("error-cause/RangeError/auto");

require("error-cause/ReferenceError/auto");

require("error-cause/SyntaxError/auto");

require("error-cause/TypeError/auto");

require("error-cause/URIError/auto");

require("error-cause/AggregateError/auto");

new Error(a, {
  cause: b
});
new EvalError(a, {
  cause: b
});
new RangeError(a, {
  cause: b
});
new ReferenceError(a, {
  cause: b
});
new SyntaxError(a, {
  cause: b
});
new TypeError(a, {
  cause: b
});
new URIError(a, {
  cause: b
});
new AggregateError(errors, a, {
  cause: b
});
