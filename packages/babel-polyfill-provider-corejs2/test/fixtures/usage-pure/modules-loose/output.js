"use strict";

var _Object$keys = require("@babel/runtime-corejs2/core-js/object/keys");

exports.__esModule = true;
var _exportNames = {
  exp: true
};
exports.exp = void 0;

var _from = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/from"));

var _bar = _interopRequireDefault(require("bar"));

var _fuz = require("fuz");

var _mod = require("mod");

_Object$keys(_mod).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _mod[key];
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exp = _bar.default + _fuz.baz;
exports.exp = exp;
(0, _from.default)(_bar.default);
