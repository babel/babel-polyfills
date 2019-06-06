export function loadProvider(
  name: string,
  dirname: string,
): { filepath: string, value: mixed } {
  throw new Error(
    `Cannot load polyfill provider ${name} relative to ${dirname} in a browser`,
  );
}
