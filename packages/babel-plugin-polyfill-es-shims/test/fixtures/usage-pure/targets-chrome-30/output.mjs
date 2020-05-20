var _foo;

import _ArrayPrototypeIncludes from "array-includes";
import _StringPrototypeIncludes from "string.prototype.includes";
(_foo = foo, typeof _foo === "string" ? _StringPrototypeIncludes : Array.isArray(_foo) ? _ArrayPrototypeIncludes : Function.call.bind(_foo.includes))(_foo, 2);
