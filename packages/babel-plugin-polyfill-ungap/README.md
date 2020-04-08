# babel-plugin-polyfill-ungap

> :warning: **This package hasn't been published yet.**

## Install

Using npm:

```sh
npm install --save-dev babel-plugin-polyfill-ungap
```

or using yarn:

```sh
yarn add babel-plugin-polyfill-ungap --dev
```

## Options

### `essential: boolean`

When enabled, prefer using essential polyfills. `Symbol` is only polyfilled with `essential: true`.

### `mode: "cjs" | "esm"`

Use this option to choose between importing `@ungap/.../cjs/index.js` or `@ungap/.../esm/index.js`.
Defaults to `esm` when using Webpack or Rollup, otherwise defaults to `cjs`.
