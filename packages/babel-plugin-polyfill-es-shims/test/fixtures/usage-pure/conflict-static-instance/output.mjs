var _obj, _obj2, _obj3, _str;

import _ObjectEntries from "object.entries";
import _ArrayPrototypeEntries from "array.prototype.entries";
import _ArrayPrototypeKeys from "array.prototype.keys";
import _ObjectValues from "object.values";
import _ArrayPrototypeValues from "array.prototype.values";
import _StringPrototypeSplit from "string.prototype.split";

_ObjectEntries();

(_obj = obj, Array.isArray(_obj) ? _ArrayPrototypeEntries : Function.call.bind(_obj.entries))(_obj);

_ArrayPrototypeEntries([]);

Object.keys();
(_obj2 = obj, Array.isArray(_obj2) ? _ArrayPrototypeKeys : Function.call.bind(_obj2.keys))(_obj2);

_ArrayPrototypeKeys([]);

_ObjectValues();

(_obj3 = obj, Array.isArray(_obj3) ? _ArrayPrototypeValues : Function.call.bind(_obj3.values))(_obj3);

_ArrayPrototypeValues([]);

Symbol.split;

_StringPrototypeSplit.getPolyfill();

_str = str, typeof _str === "string" ? _StringPrototypeSplit.getPolyfill() : _str.split;
