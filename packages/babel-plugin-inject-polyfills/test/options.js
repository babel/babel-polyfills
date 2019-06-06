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

function withMethod(method) {
  return transform("code", { method, providers: [provider()] });
}

function withProviders(providers) {
  return transform("code", { method: "usage-global", providers });
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

describe("providers", () => {
  it("must be an array", () => {
    expect(() => withProviders({})).toThrow(/array/);
  });

  it("must not be empty", () => {
    expect(() => withProviders([]).toThrow(/not empty|at least one/));
  });
});
