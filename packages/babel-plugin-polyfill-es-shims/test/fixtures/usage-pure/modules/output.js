"use strict";

var _ArrayPrototypeKeys = require("array.prototype.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  exp: true
};
exports.exp = void 0;

var _arrayIncludes = _interopRequireDefault(require("array-includes"));

var _bar = _interopRequireDefault(require("bar"));

var _fuz = require("fuz");

var _mod = require("mod");

(_Object = Object, Array.isArray(_Object) ? _ArrayPrototypeKeys : Function.call.bind(_Object.keys))(_Object, _mod).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mod[key];
    }
  });
});

var _foo, _Object;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exp = _bar.default + _fuz.baz;
exports.exp = exp;
_foo = _bar.default, Array.isArray(_foo) ? _arrayIncludes.default.getPolyfill() : _foo.includes;
