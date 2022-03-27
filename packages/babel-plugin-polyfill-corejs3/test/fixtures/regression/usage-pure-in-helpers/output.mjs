import _Reflect$construct from "core-js-pure/stable/reflect/construct.js";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _concatInstanceProperty from "core-js-pure/stable/instance/concat.js";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

let A = /*#__PURE__*/function (_B) {
  _inherits(A, _B);

  var _super = _createSuper(A);

  function A(...args) {
    var _context;

    var _this;

    _classCallCheck(this, A);

    _this = _super.call.apply(_super, _concatInstanceProperty(_context = [this]).call(_context, args));

    _defineProperty(_assertThisInitialized(_this), "b", 1);

    return _this;
  }

  return _createClass(A);
}(B);
