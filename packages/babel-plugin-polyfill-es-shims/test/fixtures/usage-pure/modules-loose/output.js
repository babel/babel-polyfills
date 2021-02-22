"use strict";

exports.__esModule = true;
var _exportNames = {
  exp: true
};
exports.exp = void 0;

var _arrayIncludes = _interopRequireDefault(require("array-includes"));

var _stringPrototype = _interopRequireDefault(require("string.prototype.includes"));

var _bar = _interopRequireDefault(require("bar"));

var _fuz = require("fuz");

var _mod = require("mod");

Object.keys(_mod).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mod[key]) return;
  exports[key] = _mod[key];
});

var _foo;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exp = _bar.default + _fuz.baz;
exports.exp = exp;
_foo = _bar.default, typeof _foo === "string" ? _stringPrototype.default.getPolyfill() : Array.isArray(_foo) ? _arrayIncludes.default.getPolyfill() : _foo.includes;
