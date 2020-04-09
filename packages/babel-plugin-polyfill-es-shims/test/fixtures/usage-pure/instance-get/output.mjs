var _foo, _keys, _foo2;

import _ArrayPrototypeIncludes from "array-includes";
_foo = foo, Array.isArray(_foo) ? _ArrayPrototypeIncludes.getPolyfill() : _foo.includes;
_keys = keys(bar), Array.isArray(_keys) ? _ArrayPrototypeIncludes.getPolyfill() : _keys.includes;
(_foo2 = foo, Array.isArray(_foo2) ? _ArrayPrototypeIncludes.getPolyfill() : _foo2.includes).apply(bar, [1, 2]);
foo.includes = 42;
