var _applyDecs = require("@babel/runtime-corejs3/helpers/applyDecs2305").default;
var _dec, _init_foo;
require("core-js/modules/esnext.function.metadata.js");
require("core-js/modules/esnext.symbol.metadata.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
_dec = dec;
class A {
  static {
    [_init_foo] = _applyDecs(this, [[_dec, 0, "foo"]], []).e;
  }
  foo = _init_foo(this, 2);
}
