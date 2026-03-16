import * as babel from "@babel/core";
import definePolyfillProvider from "../lib";

function transform(code, method, obj) {
  return babel.transformSync(code, {
    configFile: false,
    plugins: [[definePolyfillProvider(() => obj), { method }]],
  });
}

function getDescriptor(code, filter, useEntry) {
  const fn = jest.fn();

  transform(code, useEntry ? "entry-global" : "usage-global", {
    entryGlobal: fn,
    usageGlobal: fn,
  });

  let args;
  if (filter) {
    const test =
      typeof filter === "string"
        ? ([d]) => d.kind === filter
        : ([d]) => filter(d);
    args = fn.mock.calls.find(test);
  } else {
    expect(fn).toHaveBeenCalledTimes(1);
    args = fn.mock.calls[0];
  }

  return [args[0], args[2], fn];
}

describe("descriptors", () => {
  it("import", () => {
    const [desc, path] = getDescriptor(`import "foo";`, null, true);

    expect(desc).toEqual({ kind: "import", source: "foo" });
    expect(path.type).toBe("ImportDeclaration");
    expect(path.toString()).toBe(`import "foo";`);
  });

  it("require", () => {
    const [desc, path] = getDescriptor(`require("foo");`, null, true);

    expect(desc).toEqual({ kind: "import", source: "foo" });
    expect(path.type).toBe("ExpressionStatement");
    expect(path.toString()).toBe(`require("foo");`);
  });

  it("global", () => {
    const [desc, path] = getDescriptor("Promise;");

    expect(desc).toEqual({ kind: "global", name: "Promise" });
    expect(path.type).toBe("Identifier");
    expect(path.toString()).toBe("Promise");
  });

  it("static property", () => {
    const [desc, path] = getDescriptor("Promise.try;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Promise",
      key: "try",
      placement: "static",
    });
    expect(path.type).toBe("MemberExpression");
    expect(path.toString()).toBe("Promise.try");
  });

  it("prototype property", () => {
    const [desc, path] = getDescriptor(
      "Element.prototype.appendChild;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Element",
      key: "appendChild",
      placement: "prototype",
    });
    expect(path.type).toBe("MemberExpression");
    expect(path.toString()).toBe("Element.prototype.appendChild");
  });

  it("instance property - known type", () => {
    const [desc, path] = getDescriptor("[].includes;");

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "includes",
      placement: "prototype",
    });
    expect(path.type).toBe("MemberExpression");
    expect(path.toString()).toBe("[].includes");
  });

  it("instance property - unknown type", () => {
    const [desc, path] = getDescriptor("foo().includes;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "includes",
      placement: null,
    });
    expect(path.type).toBe("MemberExpression");
    expect(path.toString()).toBe("foo().includes");
  });

  it("symbol property", () => {
    const [desc, path] = getDescriptor(
      "NodeList.prototype[Symbol.iterator];",
      d => d.object === "NodeList",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "NodeList",
      key: "Symbol.iterator",
      placement: "prototype",
    });
    expect(path.type).toBe("MemberExpression");
    expect(path.toString()).toBe("NodeList.prototype[Symbol.iterator]");
  });

  it("destruturing", () => {
    const [desc, path] = getDescriptor("var { all } = Promise;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Promise",
      key: "all",
      placement: "static",
    });
    expect(path.type).toBe("ObjectProperty");
    expect(path.toString()).toBe("all");
  });

  it("in expression", () => {
    const [desc, path] = getDescriptor("'values' in Object;", "in");

    expect(desc).toEqual({
      kind: "in",
      object: "Object",
      key: "values",
      placement: "static",
    });
    expect(path.type).toBe("BinaryExpression");
    expect(path.toString()).toBe("'values' in Object");
  });

  it("optional chains", () => {
    const [desc, path] = getDescriptor("a?.includes();", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "a",
      key: "includes",
      placement: "static",
    });
    expect(path.type).toBe("OptionalMemberExpression");
    expect(path.toString()).toBe("a?.includes");
  });

  it("instance property - numeric literal", () => {
    const [desc] = getDescriptor("(1).toFixed;");

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - string literal", () => {
    const [desc] = getDescriptor("'hello'.includes;");

    expect(desc).toEqual({
      kind: "property",
      object: "String",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - template literal", () => {
    const [desc] = getDescriptor("`hello`.includes;");

    expect(desc).toEqual({
      kind: "property",
      object: "String",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - boolean literal", () => {
    const [desc] = getDescriptor("true.toString;");

    expect(desc).toEqual({
      kind: "property",
      object: "Boolean",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - bigint literal", () => {
    const [desc] = getDescriptor("(1n).toString;");

    expect(desc).toEqual({
      kind: "property",
      object: "BigInt",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - regexp literal", () => {
    const [desc] = getDescriptor("/foo/.test;");

    expect(desc).toEqual({
      kind: "property",
      object: "RegExp",
      key: "test",
      placement: "prototype",
    });
  });

  it("instance property - object expression", () => {
    const [desc] = getDescriptor("({}).hasOwnProperty;");

    expect(desc).toEqual({
      kind: "property",
      object: "Object",
      key: "hasOwnProperty",
      placement: "prototype",
    });
  });

  it("instance property - function expression", () => {
    const [desc] = getDescriptor("(function(){}).bind;");

    expect(desc).toEqual({
      kind: "property",
      object: "Function",
      key: "bind",
      placement: "prototype",
    });
  });

  it("instance property - arrow function", () => {
    const [desc] = getDescriptor("(() => {}).bind;");

    expect(desc).toEqual({
      kind: "property",
      object: "Function",
      key: "bind",
      placement: "prototype",
    });
  });

  it("instance property - class expression", () => {
    const [desc] = getDescriptor("(class {}).name;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Function",
      key: "name",
      placement: "prototype",
    });
  });

  it("instance property - new expression with known constructor", () => {
    const [desc] = getDescriptor("new Map().get;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Map",
      key: "get",
      placement: "prototype",
    });
  });

  it("instance property - new expression with unknown constructor", () => {
    const [desc] = getDescriptor(
      "var Foo = class {}; new Foo().bar;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "bar",
      placement: null,
    });
  });

  it("instance property - typeof produces string", () => {
    const [desc] = getDescriptor("(typeof x).includes;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "String",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - logical not produces boolean", () => {
    const [desc] = getDescriptor("(!0).toString;");

    expect(desc).toEqual({
      kind: "property",
      object: "Boolean",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - unary plus produces number", () => {
    const [desc] = getDescriptor('(+"5").toFixed;');

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - unary minus on number literal produces number", () => {
    const [desc] = getDescriptor("(-1).toFixed;");

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - unary minus on unknown is ambiguous", () => {
    const [desc] = getDescriptor("(-x).foo;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "foo",
      placement: null,
    });
  });

  it("instance property - unary minus on bigint produces bigint", () => {
    const [desc] = getDescriptor("(-1n).toString;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "BigInt",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - unary minus on const bigint produces bigint", () => {
    const [desc] = getDescriptor("const n = 1n; (-n).toString;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "BigInt",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - bitwise not on number literal produces number", () => {
    const [desc] = getDescriptor("(~1).toFixed;");

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - bitwise not on unknown is ambiguous", () => {
    const [desc] = getDescriptor("(~x).foo;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "foo",
      placement: null,
    });
  });

  it("instance property - bitwise not on bigint produces bigint", () => {
    const [desc] = getDescriptor("(~1n).toString;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "BigInt",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - postfix increment on non-constant is ambiguous", () => {
    const [desc] = getDescriptor("var i = 0; (i++).toFixed;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "toFixed",
      placement: null,
    });
  });

  it("instance property - subtraction of numbers produces number", () => {
    const [desc] = getDescriptor(
      "var a = 1, b = 2; (a - b).toFixed;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - subtraction of bigints produces bigint", () => {
    const [desc] = getDescriptor("(1n - 2n).toString;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "BigInt",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - subtraction of bigint variables produces bigint", () => {
    const [desc] = getDescriptor(
      "const a = 1n, b = 2n; (a - b).toString;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "BigInt",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - subtraction with unknown operands is ambiguous", () => {
    const [desc] = getDescriptor("var a; var b; (a - b).foo;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "foo",
      placement: null,
    });
  });

  it("instance property - multiplication produces number", () => {
    const [desc] = getDescriptor(
      "var a = 1, b = 2; (a * b).toFixed;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - bitwise and produces number", () => {
    const [desc] = getDescriptor(
      "var a = 1, b = 2; (a & b).toFixed;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - unsigned right shift always produces number", () => {
    const [desc] = getDescriptor("(x >>> 1).toFixed;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - strict equality produces boolean", () => {
    const [desc] = getDescriptor(
      "var a = 1, b = 2; (a === b).toString;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Boolean",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - instanceof produces boolean", () => {
    const [desc] = getDescriptor(
      "var a = []; (a instanceof Array).toString;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Boolean",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - addition of two numbers produces number", () => {
    const [desc] = getDescriptor("(1 + 2).toFixed;");

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - addition with string produces string", () => {
    const [desc] = getDescriptor('("a" + 1).includes;');

    expect(desc).toEqual({
      kind: "property",
      object: "String",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - addition string on right produces string", () => {
    const [desc] = getDescriptor('(1 + "b").includes;');

    expect(desc).toEqual({
      kind: "property",
      object: "String",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - addition of two strings produces string", () => {
    const [desc] = getDescriptor('("a" + "b").includes;');

    expect(desc).toEqual({
      kind: "property",
      object: "String",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - addition of template literal and number produces string", () => {
    const [desc] = getDescriptor("(`a` + 1).includes;");

    expect(desc).toEqual({
      kind: "property",
      object: "String",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - addition of two bigints produces bigint", () => {
    const [desc] = getDescriptor("(1n + 2n).toString;");

    expect(desc).toEqual({
      kind: "property",
      object: "BigInt",
      key: "toString",
      placement: "prototype",
    });
  });

  it("instance property - addition of number variables produces number", () => {
    const [desc] = getDescriptor(
      "const a = 1, b = 2; (a + b).toFixed;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Number",
      key: "toFixed",
      placement: "prototype",
    });
  });

  it("instance property - addition with unknown operands is ambiguous", () => {
    const [desc] = getDescriptor("var a; var b; (a + b).foo;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "foo",
      placement: null,
    });
  });

  it("instance property - sequence expression resolves last element", () => {
    const [desc] = getDescriptor("var a; (a, []).includes;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - assignment expression resolves right side", () => {
    const [desc] = getDescriptor("var a; (a = []).includes;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - conditional same type on both branches", () => {
    const [desc] = getDescriptor("var a; (a ? [] : []).includes;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - conditional different types on branches", () => {
    const [desc] = getDescriptor("var a; (a ? [] : {}).foo;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "foo",
      placement: null,
    });
  });

  it("instance property - resolved through variable", () => {
    const [desc] = getDescriptor("const x = []; x.includes;", "property");

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "includes",
      placement: "prototype",
    });
  });

  it("instance property - resolved through multiple variables", () => {
    const [desc] = getDescriptor(
      "const x = []; const y = x; y.includes;",
      "property",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "includes",
      placement: "prototype",
    });
  });

  it("globalThis.X produces both property and global descriptors", () => {
    const fn = jest.fn();

    transform("globalThis.Promise;", "usage-global", {
      usageGlobal: fn,
    });

    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "property",
        object: "globalThis",
        key: "Promise",
        placement: "static",
      }),
      expect.anything(),
      expect.anything(),
    );
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global", name: "globalThis" }),
      expect.anything(),
      expect.anything(),
    );
  });

  it("window.X produces both property and global descriptors", () => {
    const fn = jest.fn();

    transform("window.Promise;", "usage-global", {
      usageGlobal: fn,
    });

    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "property",
        object: "window",
        key: "Promise",
        placement: "static",
      }),
      expect.anything(),
      expect.anything(),
    );
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global", name: "window" }),
      expect.anything(),
      expect.anything(),
    );
  });

  it("globalThis.X reports globalThis even when provider skips object", () => {
    const fn = jest.fn(meta => {
      if (meta.kind === "property") return true;
    });

    transform("globalThis.Promise;", "usage-global", {
      usageGlobal: fn,
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "property",
        object: "globalThis",
        key: "Promise",
      }),
      expect.anything(),
      expect.anything(),
    );
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global", name: "globalThis" }),
      expect.anything(),
      expect.anything(),
    );
  });

  it("non-global-object property does not report object when provider skips", () => {
    const fn = jest.fn(meta => {
      if (meta.kind === "property") return true;
    });

    transform("Promise.all;", "usage-global", {
      usageGlobal: fn,
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "property",
        object: "Promise",
        key: "all",
      }),
      expect.anything(),
      expect.anything(),
    );
  });

  it("usage-pure: globalThis.X does not report globalThis when provider replaces path", () => {
    const fn = jest.fn((meta, utils, path) => {
      if (meta.kind === "property") {
        path.replaceWith(path.scope.generateUidIdentifier("polyfilled"));
      }
    });

    transform("globalThis.Promise;", "usage-pure", {
      usagePure: fn,
    });

    expect(fn).not.toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global", name: "globalThis" }),
      expect.anything(),
      expect.anything(),
    );
  });

  it("static property through global object - window.Object.values", () => {
    const [desc] = getDescriptor(
      "window.Object.values;",
      d => d.kind === "property" && d.key === "values",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Object",
      key: "values",
      placement: "static",
    });
  });

  it("static property through global object - globalThis.Object.keys", () => {
    const [desc] = getDescriptor(
      "globalThis.Object.keys;",
      d => d.kind === "property" && d.key === "keys",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Object",
      key: "keys",
      placement: "static",
    });
  });

  it("static property through global object - self.Array.from", () => {
    const [desc] = getDescriptor(
      "self.Array.from;",
      d => d.kind === "property" && d.key === "from",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "from",
      placement: "static",
    });
  });

  it("prototype property through global object - window.Array.prototype.includes", () => {
    const [desc] = getDescriptor(
      "window.Array.prototype.includes;",
      d => d.kind === "property" && d.key === "includes",
    );

    expect(desc).toEqual({
      kind: "property",
      object: "Array",
      key: "includes",
      placement: "prototype",
    });
  });

  it("global object property does not resolve through non-global objects", () => {
    const [desc] = getDescriptor(
      "something.Object.values;",
      d => d.kind === "property" && d.key === "values",
    );

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "values",
      placement: null,
    });
  });

  it("global object property does not resolve through local bindings", () => {
    const [desc] = getDescriptor(
      "var window = {}; window.Object.values;",
      d => d.kind === "property" && d.key === "values",
    );

    expect(desc).toEqual({
      kind: "property",
      object: null,
      key: "values",
      placement: null,
    });
  });
});
