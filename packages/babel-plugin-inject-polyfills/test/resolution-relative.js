import * as babel from "@babel/core";
import path from "path";

const base = path.join(__dirname, "fixtures", "resolution-relative");

function runBabel(folder, inputPath) {
  const cwd = path.join(base, folder);
  const filename = path.join(cwd, inputPath);
  return babel.transformFileSync(filename, { cwd }).code;
}

function string(value) {
  return `"${value}";`;
}

describe("provider resolution node_modules", function() {
  it("root file and root config", function() {
    const out = runBabel("root-config", "./index.js");

    expect(out).toBe(string("root-config__provider"));
  });

  it("nested file and root config", function() {
    const out = runBabel("root-config", "./nested/index.js");

    expect(out).toBe(string("root-config__provider"));
  });

  it("root file and root babelrc", function() {
    const out = runBabel("root-babelrc", "./index.js");

    expect(out).toBe(string("root-babelrc__provider"));
  });

  it("nested file and root babelrc", function() {
    const out = runBabel("root-babelrc", "./nested/index.js");

    expect(out).toBe(string("root-babelrc__provider"));
  });

  it("root file and nested babelrc", function() {
    const out = runBabel("nested-babelrc", "./index.js");

    expect(out).toBe(string("replace me"));
  });

  it("nested file and nested babelrc", function() {
    const out = runBabel("nested-babelrc", "./nested/index.js");

    expect(out).toBe(string("nested-babelrc__provider"));
  });

  it("root file and nested babelrc with root config", function() {
    const out = runBabel("nested-babelrc-root-config", "./index.js");

    expect(out).toBe(string("replace me"));
  });

  it("nested file and nested babelrc with root config", function() {
    const out = runBabel("nested-babelrc-root-config", "./nested/index.js");

    expect(out).toBe(string("nested-babelrc-root-config__provider"));
  });
});
