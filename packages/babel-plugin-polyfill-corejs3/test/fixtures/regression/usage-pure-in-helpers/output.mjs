import _Reflect$construct from "core-js-pure/stable/reflect/construct.js";
import _createClass from "@babel/runtime-corejs3/helpers/createClass";
import _classCallCheck from "@babel/runtime-corejs3/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime-corejs3/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime-corejs3/helpers/getPrototypeOf";
import _inherits from "@babel/runtime-corejs3/helpers/inherits";
import _defineProperty from "@babel/runtime-corejs3/helpers/defineProperty";
import _concatInstanceProperty from "core-js-pure/stable/instance/concat.js";
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? _Reflect$construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
let A = /*#__PURE__*/function (_B) {
  function A(...args) {
    var _context;
    var _this;
    _classCallCheck(this, A);
    _this = _callSuper(this, A, _concatInstanceProperty(_context = []).call(_context, args));
    _defineProperty(_this, "b", 1);
    return _this;
  }
  _inherits(A, _B);
  return _createClass(A);
}(B);
