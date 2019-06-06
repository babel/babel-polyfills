import * as babel from "@babel/core";
import thisPlugin from "../lib";

function transform(code, options) {
  return babel.transformSync(code, {
    configFile: false,
    plugins: [[thisPlugin, options]],
  });
}

function provider(obj) {
  return () => obj;
}

describe("entry-global", () => {
  it("is a valid method", () => {
    expect(() =>
      transform("", {
        method: "entry-global",
        providers: [provider({})],
      }),
    ).not.toThrow();
  });

  it("calls the entryGlobal function", () => {
    const entryGlobal = jest.fn();
    const usageGlobal = jest.fn();
    const usagePure = jest.fn();

    transform(`import "polyfill";`, {
      method: "entry-global",
      providers: [provider({ entryGlobal, usageGlobal, usagePure })],
    });

    expect(entryGlobal).toHaveBeenCalled();
    expect(usageGlobal).not.toHaveBeenCalled();
    expect(usagePure).not.toHaveBeenCalled();
  });

  it("import declaration", () => {
    const entryGlobal = jest.fn();

    transform(`import "my-polyfill";`, {
      method: "entry-global",
      providers: [provider({ entryGlobal })],
    });

    expect(entryGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "import" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("require call", () => {
    const entryGlobal = jest.fn();

    transform(`require("my-polyfill");`, {
      method: "entry-global",
      providers: [provider({ entryGlobal })],
    });

    expect(entryGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "import" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("ignores global", () => {
    const entryGlobal = jest.fn();

    transform(`Promise;`, {
      method: "entry-global",
      providers: [provider({ entryGlobal })],
    });

    expect(entryGlobal).not.toHaveBeenCalled();
  });

  it("ignores property", () => {
    const entryGlobal = jest.fn();

    transform(`arr.includes();`, {
      method: "entry-global",
      providers: [provider({ entryGlobal })],
    });

    expect(entryGlobal).not.toHaveBeenCalled();
  });
});

describe("usage-global", () => {
  it("is a valid method", () => {
    expect(() =>
      transform("", {
        method: "usage-global",
        providers: [provider({})],
      }),
    ).not.toThrow();
  });

  it("calls the usageGlobal function", () => {
    const entryGlobal = jest.fn();
    const usageGlobal = jest.fn();
    const usagePure = jest.fn();

    transform(`foo;`, {
      method: "usage-global",
      providers: [provider({ entryGlobal, usageGlobal, usagePure })],
    });

    expect(entryGlobal).not.toHaveBeenCalled();
    expect(usageGlobal).toHaveBeenCalled();
    expect(usagePure).not.toHaveBeenCalled();
  });

  it("global", () => {
    const usageGlobal = jest.fn();

    transform(`Promise;`, {
      method: "usage-global",
      providers: [provider({ usageGlobal })],
    });

    expect(usageGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("member expression", () => {
    const usageGlobal = jest.fn();

    transform(`arr.includes();`, {
      method: "usage-global",
      providers: [provider({ usageGlobal })],
    });

    expect(usageGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "property" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("destructuring", () => {
    const usageGlobal = jest.fn();

    transform(`var { includes } = arr;`, {
      method: "usage-global",
      providers: [provider({ usageGlobal })],
    });

    expect(usageGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "property" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("ignores import declaration", () => {
    const usageGlobal = jest.fn();

    transform(`import "my-polyfill";`, {
      method: "usage-global",
      providers: [provider({ usageGlobal })],
    });

    expect(usageGlobal).not.toHaveBeenCalled();
  });

  it("called on the require id for require calls", () => {
    const usageGlobal = jest.fn();

    transform(`require("my-polyfill");`, {
      method: "usage-global",
      providers: [provider({ usageGlobal })],
    });

    expect(usageGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global" }),
      expect.anything(), // utils
      expect.objectContaining({ type: "Identifier" }), // path
    );
  });
});

describe("usage-pure", () => {
  it("is a valid method", () => {
    expect(() =>
      transform("", {
        method: "usage-pure",
        providers: [provider({})],
      }),
    ).not.toThrow();
  });

  it("calls the usagePure function", () => {
    const entryGlobal = jest.fn();
    const usageGlobal = jest.fn();
    const usagePure = jest.fn();

    transform(`foo;`, {
      method: "usage-pure",
      providers: [provider({ entryGlobal, usageGlobal, usagePure })],
    });

    expect(entryGlobal).not.toHaveBeenCalled();
    expect(usageGlobal).not.toHaveBeenCalled();
    expect(usagePure).toHaveBeenCalled();
  });

  it("global", () => {
    const usagePure = jest.fn();

    transform(`Promise;`, {
      method: "usage-pure",
      providers: [provider({ usagePure })],
    });

    expect(usagePure).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("member expression", () => {
    const usagePure = jest.fn();

    transform(`arr.includes();`, {
      method: "usage-pure",
      providers: [provider({ usagePure })],
    });

    expect(usagePure).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "property" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("destructuring", () => {
    const usagePure = jest.fn();

    transform(`var { includes } = arr;`, {
      method: "usage-pure",
      providers: [provider({ usagePure })],
    });

    expect(usagePure).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "property" }),
      expect.anything(), // utils
      expect.anything(), // path
    );
  });

  it("ignores import declaration", () => {
    const usagePure = jest.fn();

    transform(`import "my-polyfill";`, {
      method: "usage-pure",
      providers: [provider({ usagePure })],
    });

    expect(usagePure).not.toHaveBeenCalled();
  });

  it("called on the require id for require calls", () => {
    const usagePure = jest.fn();

    transform(`require("my-polyfill");`, {
      method: "usage-pure",
      providers: [provider({ usagePure })],
    });

    expect(usagePure).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "global" }),
      expect.anything(), // utils
      expect.objectContaining({ type: "Identifier" }), // path
    );
  });
});
