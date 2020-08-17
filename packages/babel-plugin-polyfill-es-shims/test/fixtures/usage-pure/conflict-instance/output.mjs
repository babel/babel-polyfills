var _foo;

import _StringPrototypeItem from "string.prototype.item";
import _ArrayPrototypeItem from "array.prototype.item";

_StringPrototypeItem("abc", -1);

_ArrayPrototypeItem([1, 2, 3], -1);

(_foo = foo, typeof _foo === "string" ? _StringPrototypeItem : Array.isArray(_foo) ? _ArrayPrototypeItem : Function.call.bind(_foo.item))(_foo, -1);
