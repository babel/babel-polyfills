var _foo, _bar, _Symbol, _baz;

import _FunctionPrototypeName from "function.prototype.name";
import _SymbolPrototypeDescription from "symbol.prototype.description";
import _RegExpPrototypeFlags from "regexp.prototype.flags";
_foo = foo, typeof _foo === "function" ? _FunctionPrototypeName(_foo) : _foo.name;

_FunctionPrototypeName(function f() {});

_bar = bar, _bar instanceof Symbol ? _SymbolPrototypeDescription(_bar) : _bar.description;
_Symbol = Symbol(), _Symbol instanceof Symbol ? _SymbolPrototypeDescription(_Symbol) : _Symbol.description;
_baz = baz, _baz instanceof RegExp ? _RegExpPrototypeFlags(_baz) : _baz.flags;

_RegExpPrototypeFlags(/foo/gm);
