// @flow

import resolve from "resolve";
import debounce from "lodash.debounce";

export function has(basedir: string, name: string) {
  try {
    resolve.sync(name, { basedir });
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
