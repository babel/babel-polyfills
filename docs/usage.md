## Options

### `targets`, `ignoreBrowserslistConfig`, `configPath`, `debug`

See the same options at https://babeljs.io/docs/en/babel-preset-env

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

- `usage-entry` injects polyfills for every feature not supported by your target browsers and attaches them to the global scope, providing a native-like environment. It is similar to the legacy `useBuiltIns: "entry"` option of `@babel/preset-env`.

  **Example:**

  ```js
  import "all-polyfills";

  // ↓↓↓↓

  import "object-global-polyfills/from-entries";
  import "string-global-polyfills/match-all";
  import "promise-global-polyfills/all-settled";
  ```

### `providers`

Is an array of polyfill providers, which you must install separately.

Polyfill providers names can be shortened similar to plugin and preset names:

| **Name**                  | **Imported package**                       |
| ------------------------- | ------------------------------------------ |
| `my-polyfill`             | `babel-polyfill-provider-my-polyfill`      |
| `@org/my-polyfill`        | `@org/babel-polyfill-provider-by-polyfill` |
| `@org`                    | `@org/babel-polyfill-provider`             |
| `module:any-package-name` | `any-package-name`                         |

You can also specifying options for a provider, similarly to how plugin and preset options work:

<!-- prettier-ignore -->
```json
["@babel/inject-polyfills", {
  "method": "usage-global",
  "providers": [
    ["my-polyfill", {
      // Options
      "unstableFeatures": true
    }]
  ]
}]
```

<!-- prettier-ignore-end -->

All polyfill providers accept two options: `include` and `exculde`. They are an array of strings to polyfills to be considered as not supported by the targets (`include`) or to be considered as supported (`exclude`).
