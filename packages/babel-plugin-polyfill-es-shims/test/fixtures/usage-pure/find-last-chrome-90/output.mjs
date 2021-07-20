var _arr, _arr2;

import _ArrayPrototypeFindLast from "array.prototype.findlast";
import _ArrayPrototypeFindLastIndex from "array.prototype.findlastindex";

_ArrayPrototypeFindLast([], fn);

_ArrayPrototypeFindLastIndex([], fn);

(_arr = arr, Array.isArray(_arr) ? _ArrayPrototypeFindLast : Function.call.bind(_arr.findLast))(_arr, fn);
(_arr2 = arr, Array.isArray(_arr2) ? _ArrayPrototypeFindLastIndex : Function.call.bind(_arr2.findLastIndex))(_arr2, fn);
