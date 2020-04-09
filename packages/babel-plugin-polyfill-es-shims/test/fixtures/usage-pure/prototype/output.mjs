var _foo, _foo2;

import _ArrayPrototypeSome from "array.prototype.some";

let some = _ArrayPrototypeSome.getPolyfill();

_ArrayPrototypeSome(arguments, () => true);

_ArrayPrototypeSome([], 2);

_ArrayPrototypeSome.getPolyfill().apply(obj, args);

_ArrayPrototypeSome.getPolyfill().bind(arguments);

(_foo = foo, Array.isArray(_foo) ? _ArrayPrototypeSome : Function.call.bind(_foo.some))(_foo, 2);
(_foo2 = foo, Array.isArray(_foo2) ? _ArrayPrototypeSome.getPolyfill() : _foo2.some).call(bar, () => false);
