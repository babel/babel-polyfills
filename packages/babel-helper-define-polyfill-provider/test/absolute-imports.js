import * as babel from "@babel/core";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";

function transformTest(name, cwd, file, options = {}) {
  it(name, () => {
    const inputPath = join(cwd, file);
    const outputPath = join(cwd, file.replace(".js", ".out.js"));

    const input = readFileSync(inputPath, "utf8");
    let expected;
    try {
      expected = readFileSync(outputPath, "utf8");
    } catch {
      // file not yet created
    }

    let { code } = babel.transformSync(input, {
      cwd,
      filename: inputPath,
      ...options,
    });

    code = code.replace(
      new RegExp(__dirname.replace(/\\/g, "/"), "g"),
      "<CWD>",
    );

    if (expected === undefined) {
      writeFileSync(outputPath, code);
    } else {
      expect(code).toBe(expected);
    }
  });
}

describe("true", () => {
  const cwd = join(__dirname, "fixtures", "absoluteImports", "true");

  transformTest("basic behavior", cwd, "main.js");
  transformTest("relative to config file", cwd, "nested/main.js");
  transformTest("resolved in a parent directory", cwd, "nested-2/main.js");
});

describe("string", () => {
  const cwd = join(__dirname, "fixtures", "absoluteImports", "string");

  transformTest("basic behavior", cwd, "main.js");
});

describe("subpath", () => {
  const cwd = join(__dirname, "fixtures", "absoluteImports", "subpath");

  transformTest("works", cwd, "main.js");
});
