import cp from "child_process";
import fs from "fs";

describe("missingDependencies", () => {
  const cwd = process.cwd();

  afterEach(() => {
    process.chdir(cwd);
  });

  it("logs with @babel/cli", () => {
    process.chdir(__dirname + "/spawn-fixtures/cli");
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

  it("logs with webpack", async () => {
    process.chdir(__dirname + "/spawn-fixtures/webpack");

    const { stdout, stderr } = cp.spawnSync("yarn", ["webpack", "--no-colors"]);

    const out = stdout
      .toString()
      // Remove ANSI codes
      // eslint-disable-next-line no-control-regex
      .replace(/\x1b\[.*?m/g, "")
      // Remove "introduction" (it contines unstable info like file size or
      // compilation time)
      .replace(/^.*\[built]\s*/s, "")
      // Replace env-specific directory path
      .replace(new RegExp(process.cwd(), "g"), "<CWD>");

    expect(out).toMatchInlineSnapshot(`
      "ERROR in ./src/dep.js
      Module not found: Error: Can't resolve 'es-aggregate-error/auto.js' in '<CWD>/src'
       @ ./src/dep.js 1:0-36
       @ ./src/main.js

      ERROR in ./src/main.js
      Module not found: Error: Can't resolve 'object.fromentries/auto.js' in '<CWD>/src'
       @ ./src/main.js 1:0-36
      "
    `);
    expect(stderr.toString()).toMatchInlineSnapshot(`
      "
      Some polyfills have been added but are not present in your dependencies.
      Please run one of the following commands:
      	npm install --save es-aggregate-error@^1.0.2 object.fromentries@^2.0.2
      	yarn add es-aggregate-error@^1.0.2 object.fromentries@^2.0.2

      "
    `);

    const output = await fs.promises.readFile("./output.js", "utf8");

    expect(output).toMatch(/Cannot find module 'object.fromentries/);
    expect(output).toMatch(/Cannot find module 'es-aggregate-error/);
  });

  it("logs with rollup", () => {
    process.chdir(__dirname + "/spawn-fixtures/rollup");
    const { stdout, stderr } = cp.spawnSync("yarn", ["rollup", "-c"]);

    expect(stdout.toString()).toBe("");

    const err = stderr
      .toString()
      // Remove compilation time
      .replace(/(?<=created output.js in )\d+/, "XXX");

    expect(err).toMatchInlineSnapshot(`
      "
      src/main.js → output.js...
      (!) Unresolved dependencies
      https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
      object.fromentries/auto.js (imported by src/main.js)
      es-aggregate-error/auto.js (imported by src/dep.js)
      created output.js in XXXms

      Some polyfills have been added but are not present in your dependencies.
      Please run one of the following commands:
      	npm install --save es-aggregate-error@^1.0.2 object.fromentries@^2.0.2
      	yarn add es-aggregate-error@^1.0.2 object.fromentries@^2.0.2

      "
    `);
  });
});
