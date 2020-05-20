var _foo, _keys, _foo2;

import _ArrayPrototypeIncludes from "array-includes";
import _StringPrototypeIncludes from "string.prototype.includes";
_foo = foo, typeof _foo === "string" ? _StringPrototypeIncludes.getPolyfill() : Array.isArray(_foo) ? _ArrayPrototypeIncludes.getPolyfill() : _foo.includes;
_keys = keys(bar), typeof _keys === "string" ? _StringPrototypeIncludes.getPolyfill() : Array.isArray(_keys) ? _ArrayPrototypeIncludes.getPolyfill() : _keys.includes;
(_foo2 = foo, typeof _foo2 === "string" ? _StringPrototypeIncludes.getPolyfill() : Array.isArray(_foo2) ? _ArrayPrototypeIncludes.getPolyfill() : _foo2.includes).apply(bar, [1, 2]);
foo.includes = 42;
