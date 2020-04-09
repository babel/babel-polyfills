var _foo, _keys;

import _ArrayPrototypeIncludes from "array-includes";
(_foo = foo, Array.isArray(_foo) ? _ArrayPrototypeIncludes : Function.call.bind(_foo.includes))(_foo, 1, 2, 3, 4);

_ArrayPrototypeIncludes([1, 2, 3, 4], 1);

_ArrayPrototypeIncludes('1234', '1');

(_keys = keys(bar), Array.isArray(_keys) ? _ArrayPrototypeIncludes : Function.call.bind(_keys.includes))(_keys, 1, 2);
