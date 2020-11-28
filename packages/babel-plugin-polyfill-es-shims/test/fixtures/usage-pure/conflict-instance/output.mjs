var _foo;

import _StringPrototypeAt from "string.prototype.at";
import _ArrayPrototypeAt from "array.prototype.at";

_StringPrototypeAt("abc", -1);

_ArrayPrototypeAt([1, 2, 3], -1);

(_foo = foo, typeof _foo === "string" ? _StringPrototypeAt : Array.isArray(_foo) ? _ArrayPrototypeAt : Function.call.bind(_foo.at))(_foo, -1);
