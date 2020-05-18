import * as babel from "@babel/core";
import definePolyfillProvider from "../lib";

function transform(code, opts, provider) {
  return babel.transformSync(code, {
    configFile: false,
    plugins: [[definePolyfillProvider(provider), opts]],
  });
}

function withMethod(method) {
  return transform("code", { method }, () => {});
}

describe("method", () => {
  it("must be a string", () => {
    expect(() => withMethod({})).toThrow(/string/);
  });

  it("throws for unexpected values", () => {
    expect(() => withMethod("foo")).toThrow(
      /entry-global.*usage-global.*usage-pure/,
    );
  });
});

describe("shouldInjectPolyfill", () => {
  it("is not compatible with .include", () => {
    expect(() =>
      transform(
        "code",
        {
          method: "usage-global",
          include: ["foo"],
          shouldInjectPolyfill() {},
        },
        () => ({}),
      ),
    ).toThrow(/include.*shouldInjectPolyfill/);
  });

  it("is not compatible with .exclude", () => {
    expect(() =>
      transform(
        "code",
        {
          method: "usage-global",
          exclude: ["foo"],
          shouldInjectPolyfill() {},
        },
        () => ({}),
      ),
    ).toThrow(/exclude.*shouldInjectPolyfill/);
  });

  it("should receive the correct default shouldInject (true)", () => {
    let args;

    transform(
      "code",
      {
        method: "usage-global",
        targets: { chrome: 50 },
        shouldInjectPolyfill(...xs) {
          args = xs;
          return true;
        },
      },
      ({ shouldInjectPolyfill }) => ({
        polyfills: {
          foo: { chrome: 60 },
        },
        usageGlobal() {
          shouldInjectPolyfill("foo");
        },
      }),
    );

    expect(args).toEqual(["foo", true]);
  });

  it("should receive the correct default shouldInject (false)", () => {
    let args;

    transform(
      "code",
      {
        method: "usage-global",
        targets: { chrome: 50 },
        shouldInjectPolyfill(...xs) {
          args = xs;
          return true;
        },
      },
      ({ shouldInjectPolyfill }) => ({
        polyfills: {
          foo: { chrome: 40 },
        },
        usageGlobal() {
          shouldInjectPolyfill("foo");
        },
      }),
    );

    expect(args).toEqual(["foo", false]);
  });

  it("can override the default shouldInject (true -> false)", () => {
    let result;

    transform(
      "code",
      {
        method: "usage-global",
        targets: { chrome: 50 },
        shouldInjectPolyfill() {
          return false;
        },
      },
      ({ shouldInjectPolyfill }) => ({
        polyfills: {
          foo: { chrome: 60 },
        },
        usageGlobal() {
          result = shouldInjectPolyfill("foo");
        },
      }),
    );

    expect(result).toBe(false);
  });

  it("can override the default shouldInject (false -> true)", () => {
    let result;

    transform(
      "code",
      {
        method: "usage-global",
        targets: { chrome: 50 },
        shouldInjectPolyfill() {
          return true;
        },
      },
      ({ shouldInjectPolyfill }) => ({
        polyfills: {
          foo: { chrome: 40 },
        },
        usageGlobal() {
          result = shouldInjectPolyfill("foo");
        },
      }),
    );

    expect(result).toBe(true);
  });
});
