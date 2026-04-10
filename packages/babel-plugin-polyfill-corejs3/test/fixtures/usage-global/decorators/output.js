var _applyDecs = require("@babel/runtime-corejs3/helpers/applyDecs2311").default;
let _init_foo, _init_extra_foo;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/esnext.function.metadata.js");
require("core-js/modules/esnext.symbol.metadata.js");
require("core-js/modules/web.dom-collections.iterator.js");
class A {
  static {
    [_init_foo, _init_extra_foo] = _applyDecs(this, [], [[dec, 0, "foo"]]).e;
  }
  constructor() {
    _init_extra_foo(this);
  }
  foo = _init_foo(this, 2);
}
