import _Promise from "@babel/runtime-corejs3/core-js/promise.js";
import _Observable from "@babel/runtime-corejs3/core-js/observable.js";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js/instance/for-each.js";
_Promise.allSettled(1, 2, 3);
_Observable(1, 2, 3);
_forEachInstanceProperty(foo).call(foo, cb);
