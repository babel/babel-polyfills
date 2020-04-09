var _a;

import _ArrayPrototypeIncludes from "array-includes";

_ArrayPrototypeIncludes("", b);

_ArrayPrototypeIncludes([], b);

(_a = a, Array.isArray(_a) ? _ArrayPrototypeIncludes : Function.call.bind(_a.includes))(_a, b);
