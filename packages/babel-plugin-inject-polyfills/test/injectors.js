import * as babel from "@babel/core";
import thisPlugin from "../lib";
import astToCode from "./helpers/ast-to-code-serializer.js";

function withUtils(code, fn, opts) {
  let result;

  const provider = () => ({
    usageGlobal(_, utils) {
      result = fn(utils);
    },
  });

  const { ast } = babel.transformSync(code, {
    configFile: false,
    plugins: [[thisPlugin, { method: "usage-global", providers: [provider] }]],
    ast: true,
    code: false,
    sourceType: "module",
    ...opts,
  });

  return { ast, result };
}

expect.addSnapshotSerializer(astToCode);

describe("injectors", () => {
  describe("injectGlobalImport", () => {
    it("in module", () => {
      const { ast, result } = withUtils("foo", utils =>
        utils.injectGlobalImport("./polyfill/foo"),
      );

      expect(ast).toMatchInlineSnapshot(`
        import "./polyfill/foo";
        foo;
      `);

      expect(result).toBeUndefined();
    });

    it("in script", () => {
      const { ast, result } = withUtils(
        "foo",
        utils => utils.injectGlobalImport("./polyfill/foo"),
        { sourceType: "script" },
      );

      expect(ast).toMatchInlineSnapshot(`
        require("./polyfill/foo");

        foo;
      `);

      expect(result).toBeUndefined();
    });

    it("multiple imports, different path", () => {
      const { ast } = withUtils("foo", utils => {
        utils.injectGlobalImport("./polyfill/foo");
        utils.injectGlobalImport("./polyfill/bar");
      });

      expect(ast).toMatchInlineSnapshot(`
        import "./polyfill/foo";
        import "./polyfill/bar";
        foo;
      `);
    });

    it("multiple imports, same path", () => {
      const { ast } = withUtils("foo", utils => {
        utils.injectGlobalImport("./polyfill/foo");
        utils.injectGlobalImport("./polyfill/foo");
      });

      expect(ast).toMatchInlineSnapshot(`
        import "./polyfill/foo";
        foo;
      `);
    });
  });

  describe("injectNamedImport", () => {
    it("returns an identifier", () => {
      const { result } = withUtils("foo", utils =>
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill"),
      );

      expect(result).toEqual(
        expect.objectContaining({
          type: "Identifier",
        }),
      );
    });

    it("in script", () => {
      const { ast } = withUtils("foo", utils => {
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill");
      });

      expect(ast).toMatchInlineSnapshot(`
        import { fooPolyfill as _fooPolyfill } from "./polyfill/foo";
        foo;
      `);
    });

    it("in script", () => {
      expect(() => {
        withUtils(
          "foo",
          utils => utils.injectNamedImport("./polyfill/foo", "fooPolyfill"),
          { sourceType: "script" },
        );
      }).toThrow();
    });

    it("respects name hint", () => {
      const { ast, result } = withUtils("foo", utils =>
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill", "dog"),
      );

      expect(ast).toMatchInlineSnapshot(`
        import { fooPolyfill as _dog } from "./polyfill/foo";
        foo;
      `);

      expect(result.name).toEqual(expect.stringContaining("dog"));
    });

    it("multiple imports, different path, different name", () => {
      const { ast, result } = withUtils("foo", utils => [
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill"),
        utils.injectNamedImport("./polyfill/bar", "barPolyfill"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import { fooPolyfill as _fooPolyfill } from "./polyfill/foo";
        import { barPolyfill as _barPolyfill } from "./polyfill/bar";
        foo;
      `);

      expect(result[0].name).not.toBe(result[1].name);
    });

    it("multiple imports, same path, different name", () => {
      const { ast, result } = withUtils("foo", utils => [
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill"),
        utils.injectNamedImport("./polyfill/foo", "barPolyfill"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import { fooPolyfill as _fooPolyfill, barPolyfill as _barPolyfill } from "./polyfill/foo";
        foo;
      `);

      expect(result[0].name).not.toBe(result[1].name);
    });

    it("multiple imports, different path, same name", () => {
      const { ast, result } = withUtils("foo", utils => [
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill"),
        utils.injectNamedImport("./polyfill/bar", "fooPolyfill"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import { fooPolyfill as _fooPolyfill } from "./polyfill/foo";
        import { fooPolyfill as _fooPolyfill2 } from "./polyfill/bar";
        foo;
      `);

      expect(result[0].name).not.toBe(result[1].name);
    });

    it("multiple imports, same path, same name", () => {
      const { ast, result } = withUtils("foo", utils => [
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill"),
        utils.injectNamedImport("./polyfill/foo", "fooPolyfill"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import { fooPolyfill as _fooPolyfill } from "./polyfill/foo";
        foo;
      `);

      expect(result[0].name).toBe(result[1].name);
    });
  });

  describe("injectDefaultImport", () => {
    it("returns an identifier", () => {
      const { result } = withUtils("foo", utils =>
        utils.injectDefaultImport("./polyfill/foo"),
      );

      expect(result).toEqual(
        expect.objectContaining({
          type: "Identifier",
        }),
      );
    });

    it("in module", () => {
      const { ast } = withUtils("foo", utils => {
        utils.injectDefaultImport("./polyfill/foo");
      });

      expect(ast).toMatchInlineSnapshot(`
        import _polyfillFoo from "./polyfill/foo";
        foo;
      `);
    });

    it("in script", () => {
      expect(() => {
        withUtils("foo", utils => utils.injectDefaultImport("./polyfill/foo"), {
          sourceType: "script",
        });
      }).toThrow();
    });

    it("respects name hint", () => {
      const { ast, result } = withUtils("foo", utils =>
        utils.injectDefaultImport("./polyfill/foo", "dog"),
      );

      expect(ast).toMatchInlineSnapshot(`
        import _dog from "./polyfill/foo";
        foo;
      `);

      expect(result.name).toEqual(expect.stringContaining("dog"));
    });

    it("multiple imports, different path", () => {
      const { ast, result } = withUtils("foo", utils => [
        utils.injectDefaultImport("./polyfill/foo"),
        utils.injectDefaultImport("./polyfill/bar"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import _polyfillFoo from "./polyfill/foo";
        import _polyfillBar from "./polyfill/bar";
        foo;
      `);

      expect(result[0].name).not.toBe(result[1].name);
    });

    it("multiple imports, same path", () => {
      const { ast, result } = withUtils("foo", utils => [
        utils.injectDefaultImport("./polyfill/foo"),
        utils.injectDefaultImport("./polyfill/foo"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import _polyfillFoo from "./polyfill/foo";
        foo;
      `);

      expect(result[0].name).toBe(result[1].name);
    });
  });

  describe("integration", () => {
    it("all together, same path", () => {
      const { ast } = withUtils("foo", utils => [
        utils.injectNamedImport("./polyfill/foo", "foo"),
        utils.injectNamedImport("./polyfill/foo", "bar"),
        utils.injectDefaultImport("./polyfill/foo"),
        utils.injectGlobalImport("./polyfill/foo"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import _polyfillFoo, { foo as _foo, bar as _bar } from "./polyfill/foo";
        foo;
      `);
    });

    it("all together, different path", () => {
      const { ast } = withUtils("foo", utils => [
        utils.injectNamedImport("./polyfill/foo", "foo"),
        utils.injectNamedImport("./polyfill/bar", "bar"),
        utils.injectDefaultImport("./polyfill/dog"),
        utils.injectGlobalImport("./polyfill/cat"),
      ]);

      expect(ast).toMatchInlineSnapshot(`
        import { foo as _foo } from "./polyfill/foo";
        import { bar as _bar } from "./polyfill/bar";
        import _polyfillDog from "./polyfill/dog";
        import "./polyfill/cat";
        foo;
      `);
    });
  });
});
