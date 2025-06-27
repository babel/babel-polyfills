var _sliceInstanceProperty = require("core-js-pure/stable/instance/slice.js");
var _Array$from = require("core-js-pure/stable/array/from.js");
var _Symbol = require("core-js-pure/stable/symbol/index.js");
var _getIteratorMethod = require("core-js-pure/features/get-iterator-method.js");
var _Array$isArray = require("core-js-pure/stable/array/is-array.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof _Symbol && _getIteratorMethod(r) || r["@@iterator"]; if (!t) { if (_Array$isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var n = 0, F = function () {}; return { s: F, n: function () { return n >= r.length ? { done: !0 } : { done: !1, value: r[n++] }; }, e: function (r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function () { t = t.call(r); }, n: function () { var r = t.next(); return a = r.done, r; }, e: function (r) { u = !0, o = r; }, f: function () { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { var _context; if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = _sliceInstanceProperty(_context = {}.toString.call(r)).call(_context, 8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? _Array$from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _iterator = _createForOfIteratorHelper(arr),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var i = _step.value;
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
