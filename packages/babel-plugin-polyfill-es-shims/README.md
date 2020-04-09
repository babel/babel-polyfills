# babel-plugin-polyfill-es-shims

> :warning: **This package hasn't been published yet.**

## Install

Using npm:

```sh
npm install --save-dev babel-plugin-polyfill-es-shims
```

or using yarn:

```sh
yarn add babel-plugin-polyfill-es-shims --dev
```

## Usage

Add this plugin to your Babel configuration:

```json
{
  "plugins": [["polyfill-es-shims", { "method": "usage-pure" }]]
}
```

This package supports the `usage-pure` and `usage-global` methods.

## Supported polyfills

This plugin supports the following `es-shims` polyfills.

### ES5

| Builtin object or function    | Package name                  |
| :---------------------------- | :---------------------------- |
| `Array.prototype.every`       | `array.prototype.every`       |
| `Array.prototype.indexOf`     | `array.prototype.indexof`     |
| `Array.prototype.lastIndexOf` | `array.prototype.lastindexof` |
| `Array.prototype.map`         | `array.prototype.map`         |
| `Array.prototype.reduce`      | `array.prototype.reduce`      |
| `Array.prototype.reduceRight` | `array.prototype.reducetight` |
| `Array.prototype.some`        | `array.prototype.some`        |

### ES2015 (ES6)

| Builtin object or function  | Package name                |
| :-------------------------- | :-------------------------- |
| `Array.from`                | `array.from`                |
| `Array.of`                  | `array.of`                  |
| `Array.prototype.find`      | `array.prototype.find`      |
| `Array.prototype.findIndex` | `array.prototype.findindex` |
| `Array.prototype.keys`      | `array.prototype.keys`      |
| `Array.prototype.values`    | `array.prototype.values`    |
| `Function.prototype.name`   | `function.prototype.name`   |
| `Number.isNaN`              | `is-nan`                    |
| `Object.asskgin`            | `object.assign`             |
| `Reflect.ownKeys`           | `reflect.ownkeys`           |
| `RegExp.prototype.flags`    | `regexp.prototype.flags`    |

### ES2016

| Builtin object or function | Package name     |
| :------------------------- | :--------------- |
| `Array.prototype.includes` | `array-includes` |

### ES2017

| Builtin object or function         | Package name                       |
| :--------------------------------- | :--------------------------------- |
| `Object.values`                    | `object.values`                    |
| `Object.entries`                   | `object.entries`                   |
| `Object.getOwnPropertyDescriptors` | `object.getownpropertydescriptors` |
| `String.prototype.padStart`        | `string.prototype.padstart`        |
| `String.prototype.padEnd`          | `string.prototype.padend`          |

### ES2018

| Builtin object or function  | Package name                |
| :-------------------------- | :-------------------------- |
| `Promise.prototype.finally` | `promise.prototype.finally` |

### ES2019

| Builtin object or function     | Package name                   |
| :----------------------------- | :----------------------------- |
| `Array.prototype.flat`         | `array.prototype.flat`         |
| `Array.prototype.flatMap`      | `array.prototype.flatmap`      |
| `Object.fromEntries`           | `object.fromentries`           |
| `String.prototype.trimStart`   | `string.prototype.trimstart`   |
| `String.prototype.trimEnd`     | `string.prototype.trimend`     |
| `String.prototype.trimLeft`    | `string.prototype.trimleft`    |
| `String.prototype.trimRight`   | `string.prototype.trimright`   |
| `Symbol.prototype.description` | `symbol.prototype.description` |

### ES2020

| Builtin object or function  | Package name                |
| :-------------------------- | :-------------------------- |
| `globalThis`                | `globalThis`                |
| `Promise.allSettled`        | `promise.allsettled`        |
| `String.prototype.matchAll` | `string.prototype.matchall` |

### Stage 3

| Builtin object or function           | Package name                  |
| :----------------------------------- | :---------------------------- |
| `AggregateError` (for `Promise.any`) | `es-aggregate-error`          |
| `String.prototype.replaceAll`        | `string.prototype.replaceall` |
| `Promise.any`                        | `promise.any`                 |
