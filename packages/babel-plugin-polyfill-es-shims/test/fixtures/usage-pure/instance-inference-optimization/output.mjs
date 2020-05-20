var _a;

import _StringPrototypeIncludes from "string.prototype.includes";
import _ArrayPrototypeIncludes from "array-includes";

_StringPrototypeIncludes("", b);

_ArrayPrototypeIncludes([], b);

(_a = a, typeof _a === "string" ? _StringPrototypeIncludes : Array.isArray(_a) ? _ArrayPrototypeIncludes : Function.call.bind(_a.includes))(_a, b);
