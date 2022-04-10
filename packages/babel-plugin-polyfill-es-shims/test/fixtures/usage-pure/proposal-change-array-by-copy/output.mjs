var _arr, _arr2, _arr3, _arr4;

import _ArrayPrototypeWith from "array.prototype.with";
import _ArrayPrototypeToSorted from "array.prototype.tosorted";
import _ArrayPrototypeToReversed from "array.prototype.toreversed";
import _ArrayPrototypeToSpliced from "array.prototype.tospliced";

_ArrayPrototypeWith([3, 1, 2], 0, 3);

_ArrayPrototypeToSorted([3, 1, 2]);

_ArrayPrototypeToReversed([3, 1, 2]);

_ArrayPrototypeToSpliced([3, 1, 2], 1, 1, 3, 4);

(_arr = arr, Array.isArray(_arr) ? _ArrayPrototypeWith : Function.call.bind(_arr.with))(_arr, 0, 3);
(_arr2 = arr, Array.isArray(_arr2) ? _ArrayPrototypeToSorted : Function.call.bind(_arr2.toSorted))(_arr2);
(_arr3 = arr, Array.isArray(_arr3) ? _ArrayPrototypeToReversed : Function.call.bind(_arr3.toReversed))(_arr3);
(_arr4 = arr, Array.isArray(_arr4) ? _ArrayPrototypeToSpliced : Function.call.bind(_arr4.toSpliced))(_arr4, 1, 1, 3, 4);
