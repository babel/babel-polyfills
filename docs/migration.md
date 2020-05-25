## Migration from `preset-env` and `plugin-transform-runtime`

All the existig capabilities of `@babel/preset-env` and `@babel/plugin-transform-runtime` related to `core-js` are supported by the polyfill providers implemented in this repository.

> You'll notice that you currently have to duplicate your `targets` (unles you are using a `.browserslistrc` file). We are working on deduplicating the option: [`babel/rfcs#2`](https://github.com/babel/rfcs/pull/2).

### `core-js@3`

<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 },
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

</td>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["polyfill-corejs3", {
      "method": "usage-global",
      "targets": { "firefox": 42 }
    }]
  ]
}
```

</td>
</tr>
</table>
<!-- prettier-ignore-end -->


<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 },
      "useBuiltIns": "entry",
      "corejs": 3
    }]
  ]
}
```

</td>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["polyfill-corejs3", {
      "method": "usage-entry",
      "targets": { "firefox": 42 }
    }]
  ]
}
```

</td>
</tr>
</table>
<!-- prettier-ignore-end -->


<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["@babel/transform-runtime", {
      "corejs": 3
    }]
  ]
}
```

</td>
<td>

```json5
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    "@babel/transform-runtime",
    ["polyfill-corejs3", {
      "method": "usage-pure",
      // "targets": { "firefox": 42 }
    }]
  ]
}
```

**NOTE**: The "Old" config doesn't support targets for polyfills, but you'll likely want to enable them.

</td>
</tr>
</table>
<!-- prettier-ignore-end -->

### `es-shims`

<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration (with `core-js`)</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 },
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

</td>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["polyfill-es-shims", {
      "method": "usage-global",
      "targets": { "firefox": 42 }
    }]
  ]
}
```

</td>
</tr>
</table>
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration (with `core-js`)</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["@babel/transform-runtime", {
      "corejs": 3
    }]
  ]
}
```

</td>
<td>

```json5
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    "@babel/transform-runtime",
    ["polyfill-es-shims", {
      "method": "usage-pure",
      // "targets": { "firefox": 42 }
    }]
  ]
}
```

**NOTE**: The "Old" config doesn't support targets for polyfills, but you'll likely want to enable them.

</td>
</tr>
</table>
<!-- prettier-ignore-end -->

### `core-js@2`

<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 },
      "useBuiltIns": "usage",
      "corejs": 2
    }]
  ]
}
```

</td>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["polyfill-corejs2", {
      "method": "usage-global",
      "targets": { "firefox": 42 }
    }]
  ]
}
```

</td>
</tr>
</table>
<!-- prettier-ignore-end -->


<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 },
      "useBuiltIns": "entry",
      "corejs": 2
    }]
  ]
}
```

</td>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["polyfill-corejs2", {
      "method": "usage-entry",
      "targets": { "firefox": 42 }
    }]
  ]
}
```

</td>
</tr>
</table>
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
<table>
<thead><tr>
<th align="center">Old configuration</th>
<th align="center">New configuration</th>
</tr></thead>
<tr>
<td>

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    ["@babel/transform-runtime", {
      "corejs": 2
    }]
  ]
}
```

</td>
<td>

```jsonc
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "firefox": 42 }
    }]
  ],
  "plugins": [
    "@babel/transform-runtime",
    ["polyfill-corejs2", {
      "method": "usage-pure",
      // "targets": { "firefox": 42 }
    }]
  ]
}
```

**NOTE**: The "Old" config doesn't support targets for polyfills, but you'll likely want to enable them.

</td>
</tr>
</table>
<!-- prettier-ignore-end -->
