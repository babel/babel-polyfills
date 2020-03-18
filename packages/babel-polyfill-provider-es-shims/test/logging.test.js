import cp from "child_process";

describe("missingDependencies", () => {
  const cwd = process.cwd();

  afterEach(() => {
    process.chdir(cwd);
  });

  it("logs everything at the end", () => {
    process.chdir(__dirname + "/spawn-fixtures/logging");
    const { stdout, stderr } = cp.spawnSync("yarn", [
      "babel",
      "in",
      "-d",
      "out",
    ]);

    expect(stdout.toString()).toMatchInlineSnapshot(`
      "Successfully compiled 2 files with Babel.
      "
    `);
    expect(stderr.toString()).toMatchInlineSnapshot(`
      "
      Some polyfills have been added but are not present in your dependencies.
      Please run one of the following commands:
      	npm install --save globalThis@^1.0.0 is-nan@^1.2.1 promise.prototype.finally@^1.2.1
      	yarn add globalThis@^1.0.0 is-nan@^1.2.1 promise.prototype.finally@^1.2.1

      "
    `);
  });
});
