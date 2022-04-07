import { intersection } from "./utils";
import type {
  Pattern,
  PluginOptions,
  MissingDependenciesOption,
} from "./types";

function patternToRegExp(pattern: Pattern): RegExp | null {
  if (pattern instanceof RegExp) return pattern;

  try {
    return new RegExp(`^${pattern}$`);
  } catch {
    return null;
  }
}

function buildUnusedError(label, unused) {
  if (!unused.length) return "";
  return (
    `  - The following "${label}" patterns didn't match any polyfill:\n` +
    unused.map(original => `    ${String(original)}\n`).join("")
  );
}

function buldDuplicatesError(duplicates) {
  if (!duplicates.size) return "";
  return (
    `  - The following polyfills were matched both by "include" and "exclude" patterns:\n` +
    Array.from(duplicates, name => `    ${name}\n`).join("")
  );
}

export function validateIncludeExclude(
  provider: string,
  polyfills: Set<string>,
  includePatterns: Pattern[],
  excludePatterns: Pattern[],
) {
  let current;
  const filter = pattern => {
    const regexp = patternToRegExp(pattern);
    if (!regexp) return false;

    let matched = false;
    for (const polyfill of polyfills) {
      if (regexp.test(polyfill)) {
        matched = true;
        current.add(polyfill);
      }
    }
    return !matched;
  };

  // prettier-ignore
  const include = current = new Set<string> ();
  const unusedInclude = Array.from(includePatterns).filter(filter);

  // prettier-ignore
  const exclude = current = new Set<string> ();
  const unusedExclude = Array.from(excludePatterns).filter(filter);

  const duplicates = intersection(include, exclude);

  if (
    duplicates.size > 0 ||
    unusedInclude.length > 0 ||
    unusedExclude.length > 0
  ) {
    throw new Error(
      `Error while validating the "${provider}" provider options:\n` +
        buildUnusedError("include", unusedInclude) +
        buildUnusedError("exclude", unusedExclude) +
        buldDuplicatesError(duplicates),
    );
  }

  return { include, exclude };
}

export function applyMissingDependenciesDefaults(
  options: PluginOptions,
  babelApi: any,
): MissingDependenciesOption {
  const { missingDependencies = {} } = options;
  if (missingDependencies === false) return false;

  const caller = babelApi.caller(caller => caller?.name);

  const {
    log = "deferred",
    inject = caller === "rollup-plugin-babel" ? "throw" : "import",
    all = false,
  } = missingDependencies;

  return { log, inject, all };
}
