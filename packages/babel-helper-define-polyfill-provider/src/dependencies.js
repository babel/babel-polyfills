// @flow

import requireResolve from "resolve";
import path from "path";
import debounce from "lodash.debounce";

export function resolve(
  dirname: string,
  moduleName: string,
  absoluteImports: boolean | string,
): string {
  if (absoluteImports === false) return moduleName;

  let basedir = dirname;
  if (typeof absoluteImports === "string") {
    basedir = path.resolve(basedir, absoluteImports);
  }

  let modulePackage, moduleNestedPath;

  let slash = moduleName.indexOf("/");
  if (moduleName[0] === "@") {
    slash = moduleName.indexOf("/", slash + 1);
  }

  if (slash === -1) {
    modulePackage = moduleName;
    moduleNestedPath = "";
  } else {
    modulePackage = moduleName.slice(0, slash);
    moduleNestedPath = moduleName.slice(slash);
  }

  try {
    const pkg = requireResolve.sync(`${modulePackage}/package.json`, {
      basedir,
    });
    return path.dirname(pkg) + moduleNestedPath;
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") throw err;

    throw Object.assign(
      new Error(`Failed to resolve "${moduleName}" relative to "${dirname}"`),
      {
        code: "BABEL_POLYFILL_NOT_FOUND",
        polyfill: moduleName,
        dirname,
      },
    );
  }
}

export function has(basedir: string, name: string) {
  try {
    requireResolve.sync(name, { basedir });
    return true;
  } catch {
    return false;
  }
}

export function logMissing(missingDeps: Set<string>) {
  if (missingDeps.size === 0) return;

  const deps = Array.from(missingDeps)
    .sort()
    .join(" ");

  console.warn(
    "\nSome polyfills have been added but are not present in your dependencies.\n" +
      "Please run one of the following commands:\n" +
      `\tnpm install --save ${deps}\n` +
      `\tyarn add ${deps}\n`,
  );

  process.exitCode = 1;
}

let allMissingDeps = new Set();

const laterLogMissingDependencies = debounce(() => {
  logMissing(allMissingDeps);
  allMissingDeps = new Set();
}, 1000);

export function laterLogMissing(missingDeps: Set<string>) {
  missingDeps.forEach(name => allMissingDeps.add(name));
  laterLogMissingDependencies();
}
