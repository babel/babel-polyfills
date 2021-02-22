"use strict";

var _Object$defineProperty = require("core-js/library/fn/object/define-property.js");

var _Object$keys = require("core-js/library/fn/object/keys.js");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

var _bar = _interopRequireDefault(require("bar"));

var _mod = require("mod");

_Object$keys(_mod).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mod[key]) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mod[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bar.default;
