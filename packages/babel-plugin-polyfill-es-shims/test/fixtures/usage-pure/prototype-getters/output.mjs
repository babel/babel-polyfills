var _foo;

import _RegExpPrototypeFlags from "regexp.prototype.flags";
_foo = foo, _foo instanceof RegExp ? _RegExpPrototypeFlags(_foo) : _foo.flags;

_RegExpPrototypeFlags(/foo/g);
