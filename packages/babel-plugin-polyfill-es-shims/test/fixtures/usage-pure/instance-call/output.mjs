var _foo, _keys;

import _ArrayPrototypeIncludes from "array-includes";
import _StringPrototypeIncludes from "string.prototype.includes";
(_foo = foo, typeof _foo === "string" ? _StringPrototypeIncludes : Array.isArray(_foo) ? _ArrayPrototypeIncludes : Function.call.bind(_foo.includes))(_foo, 1, 2, 3, 4);

_ArrayPrototypeIncludes([1, 2, 3, 4], 1);

_StringPrototypeIncludes('1234', '1');

(_keys = keys(bar), typeof _keys === "string" ? _StringPrototypeIncludes : Array.isArray(_keys) ? _ArrayPrototypeIncludes : Function.call.bind(_keys.includes))(_keys, 1, 2);
