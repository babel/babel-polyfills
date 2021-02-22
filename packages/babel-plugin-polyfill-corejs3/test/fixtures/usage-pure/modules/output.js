"use strict";

var _context;

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _forEachInstanceProperty = require("core-js-pure/stable/instance/for-each.js");

var _Object$keys = require("core-js-pure/stable/object/keys.js");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

var _exportNames = {
  exp: true
};
exports.exp = void 0;

var _includes = _interopRequireDefault(require("core-js-pure/stable/instance/includes.js"));

var _bar = _interopRequireDefault(require("bar"));

var _fuz = require("fuz");

var _mod = require("mod");

_forEachInstanceProperty(_context = _Object$keys(_mod)).call(_context, function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mod[key]) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mod[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exp = _bar.default + _fuz.baz;
exports.exp = exp;
(0, _includes.default)(_bar.default);
