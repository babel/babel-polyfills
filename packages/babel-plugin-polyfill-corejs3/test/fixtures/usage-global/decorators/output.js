var _applyDecs = require("@babel/runtime-corejs3/helpers/applyDecs2305").default;
let _fooDecs, _init_foo;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/esnext.function.metadata.js");
require("core-js/modules/esnext.symbol.metadata.js");
require("core-js/modules/web.dom-collections.iterator.js");
class A {
  static {
    [_init_foo] = _applyDecs(this, [[_fooDecs, 0, "foo"]], []).e;
  }
  [(_fooDecs = dec, "foo")] = _init_foo(this, 2);
}
