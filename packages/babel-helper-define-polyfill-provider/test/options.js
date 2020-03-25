import * as babel from "@babel/core";
import definePolyfillProvider from "../lib";

function transform(code, method, obj) {
  return babel.transformSync(code, {
    configFile: false,
    plugins: [[definePolyfillProvider(() => obj), { method }]],
  });
}

function withMethod(method) {
  return transform("code", method, {});
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
