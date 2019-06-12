// @flow

export function loadProvider(
  name: string,
  dirname?: string = ".",
): { filepath: string, value: mixed } {
  throw new Error(
    `Cannot load polyfill provider ${name} relative to ${dirname} in a browser`,
  );
}

export function resolveProvider(name: string, dirname?: string = ".") {
  throw new Error(
    `Cannot resolve polyfill provider ${name} relative to ${dirname} in a browser`,
  );
}
