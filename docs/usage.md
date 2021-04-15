## Options

Every polyfill provider accepts the following options.
Note that they might not support filtering the polyfills based on the target
engines, but if they do they will follow this interface.

Additionally, polyfill providers can define any custom option.

### `method`

It can be one of `usage-pure`, `usage-global`, or `entry-global`.

- `usage-pure` injects polyfills for used features and calls them inline, without polluting the global scope. It is similar to the legacy `corejs` option of `@babel/plugin-transform-runtime`.

  **Example:**

  ```js
  let obj = Object.fromEntries(entries);

  // ↓↓↓↓

  import _ObjectFromEntries from "object-polyfills/from-entries";
  let obj = _ObjectFromEntries(entries);
  ```

- `usage-global` injects polyfills for used features and attaches them to the global scope. It is similar to the legacy `useBuiltIns: "usage"` option of `@babel/preset-env`.

  **Example:**

  ```js
  let obj = Object.fromEntries(entries);

  // ↓↓↓↓

  import "object-global-polyfills/from-entries";
  let obj = Object.fromEntries(entries);
  ```

- `entry-global` injects polyfills for every feature not supported by your target browsers and attaches them to the global scope, providing a native-like environment. It is similar to the legacy `useBuiltIns: "entry"` option of `@babel/preset-env`.

  **Example:**

  ```js
  import "all-polyfills";

  // ↓↓↓↓

  import "object-global-polyfills/from-entries";
  import "string-global-polyfills/match-all";
  import "promise-global-polyfills/all-settled";
  ```

### `targets`, `ignoreBrowserslistConfig`, `configPath`, `debug`

See the same options at https://babeljs.io/docs/en/babel-preset-env

> **NOTE**: It's recommended to use the [top-level options](https://babeljs.io/docs/en/options#output-targets) instead.

### `include`, `exclude`

All polyfill providers accept two options: `include` and `exclude`. They are an array of strings to polyfills to be considered as not supported by the targets (`include`) or to be considered as supported (`exclude`).

See the same options at https://babeljs.io/docs/en/babel-preset-env

## Advanced options

### `shouldInjectPolyfill`

`include` and `exclude` are great ways to forcefully mark a given polyfill as supported or unsupported.

However, sometimes you might need something mroe advanced or customized: for example, you could want to store somewhere a list of the injected polyfills, or to throw an error when a given polyfill would be included.

The `shouldInjectPolyfill` function takes two parameters: the name of the polyfill and wether or not it should be injected based on your targets. It must return a boolean, indicating wether or not the polyfill should be injected.

```js
function shouldInjectPolyfill(name: string, defaultShouldInject: boolean): boolean;
```

### `absoluteImports`

`boolean` or `string`, defaults to `false`.

This allows users to run polyfill providers broadly across a whole project. By default, polyfill providers inject a bare import to the polyfill package (for example, `core-js-pure/stable/array/from.js`), but that only works if the polyfill is in the `node_modules` of the file that is being compiled. This can be problematic for nested `node_modules`, npm-linked modules, or CLIs that reside outside the user's project, among other cases. To avoid worrying about how the runtime module's location is resolved, this allows users to resolve the runtime once up front, and then insert absolute paths to the runtime into the output code.

Using absolute paths is not desirable if files are compiled for use at a later time, but in contexts where a file is compiled and then immediately consumed, they can be quite helpful.

Reference: [babel/babel#8435](https://github.com/babel/babel/pull/8435)

### `missingDependencies`

This option modifies the dependencies detection logging. If set to `false`, dependencies
aren't checked at all (this can be useful, for example, when running in a browser).

Other than `false`, it can be an object with the following type:

```js
type MissingDependencies = {
  log?: "per-file" | "deferred",
  // When true, log all the polyfills without checking if they are installed
  all?: boolean,
};
```

- If `log` is set to `"deferred"`, all the missing polyfills are logged together. Usually it happens at the end of the whole build process, but it's not guaranteed.
- If `log` is set to `"per-file"`, the missing polyfills are logged after compiling each file.
- If `all` is set to `true`, all polyfills are logged without checking if they are installed.

The default value is `{ log: "deferred", all: false }`.
