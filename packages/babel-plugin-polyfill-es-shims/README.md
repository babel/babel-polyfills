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
The `usage-pure` methods doesn't support instance polyfills yet.

### ES5

| Builtin object or function    | `usage-global` | `usage-pure` | Package name                  |
| :---------------------------- | :------------: | :----------: | :---------------------------- |
| `Array.prototype.every`       |       Y        |      N       | `array.prototype.every`       |
| `Array.prototype.indexOf`     |       Y        |      N       | `array.prototype.indexof`     |
| `Array.prototype.lastIndexOf` |       Y        |      N       | `array.prototype.lastindexof` |
| `Array.prototype.map`         |       Y        |      N       | `array.prototype.map`         |
| `Array.prototype.reduce`      |       Y        |      N       | `array.prototype.reduce`      |
| `Array.prototype.reduceRight` |       Y        |      N       | `array.prototype.reducetight` |
| `Array.prototype.some`        |       Y        |      N       | `array.prototype.some`        |

### ES2015 (ES6)

| Builtin object or function  | `usage-global` | `usage-pure` | Package name                |
| :-------------------------- | :------------: | :----------: | :-------------------------- |
| `Array.from`                |       Y        |      Y       | `array.from`                |
| `Array.of`                  |       Y        |      Y       | `array.of`                  |
| `Array.prototype.find`      |       Y        |      N       | `array.prototype.find`      |
| `Array.prototype.findIndex` |       Y        |      N       | `array.prototype.findindex` |
| `Array.prototype.keys`      |       Y        |      N       | `array.prototype.keys`      |
| `Array.prototype.values`    |       Y        |      N       | `array.prototype.values`    |
| `Function.prototype.name`   |       Y        |      N       | `function.prototype.name`   |
| `Number.isNaN`              |       Y        |      N       | `is-nan`                    |
| `Object.asskgin`            |       Y        |      N       | `object.assign`             |
| `Reflect.ownKeys`           |       Y        |      Y       | `reflect.ownkeys`           |
| `RegExp.prototype.flags`    |       Y        |      N       | `regexp.prototype.flags`    |

### ES2016

| Builtin object or function | `usage-global` | `usage-pure` | Package name     |
| :------------------------- | :------------: | :----------: | :--------------- |
| `Array.prototype.includes` |       Y        |      N       | `array-includes` |

### ES2017

| Builtin object or function         | `usage-global` | `usage-pure` | Package name                       |
| :--------------------------------- | :------------: | :----------: | :--------------------------------- |
| `Object.values`                    |       Y        |      Y       | `object.values`                    |
| `Object.entries`                   |       Y        |      Y       | `object.entries`                   |
| `Object.getOwnPropertyDescriptors` |       Y        |      Y       | `object.getownpropertydescriptors` |
| `String.prototype.padStart`        |       Y        |      N       | `string.prototype.padstart`        |
| `String.prototype.padEnd`          |       Y        |      N       | `string.prototype.padend`          |

### ES2018

| Builtin object or function  | `usage-global` | `usage-pure` | Package name                |
| :-------------------------- | :------------: | :----------: | :-------------------------- |
| `Promise.prototype.finally` |       Y        |      N       | `promise.prototype.finally` |

### ES2019

| Builtin object or function     | `usage-global` | `usage-pure` | Package name                   |
| :----------------------------- | :------------: | :----------: | :----------------------------- |
| `Array.prototype.flat`         |       Y        |      N       | `array.prototype.flat`         |
| `Array.prototype.flatMap`      |       Y        |      N       | `array.prototype.flatmap`      |
| `Object.fromEntries`           |       Y        |      Y       | `object.fromentries`           |
| `String.prototype.trimStart`   |       Y        |      N       | `string.prototype.trimstart`   |
| `String.prototype.trimEnd`     |       Y        |      N       | `string.prototype.trimend`     |
| `String.prototype.trimLeft`    |       Y        |      N       | `string.prototype.trimleft`    |
| `String.prototype.trimRight`   |       Y        |      N       | `string.prototype.trimright`   |
| `Symbol.prototype.description` |       Y        |      N       | `symbol.prototype.description` |

### ES2020

| Builtin object or function  | `usage-global` | `usage-pure` | Package name                |
| :-------------------------- | :------------: | :----------: | :-------------------------- |
| `globalThis`                |       Y        |      Y       | `globalThis`                |
| `Promise.allSettled`        |       Y        |      Y       | `promise.allsettled`        |
| `String.prototype.matchAll` |       Y        |      N       | `string.prototype.matchall` |

### Stage 3

| Builtin object or function           | `usage-global` | `usage-pure` | Package name                  |
| :----------------------------------- | :------------: | :----------: | :---------------------------- |
| `AggregateError` (for `Promise.any`) |       Y        |      Y       | `es-aggregate-error`          |
| `String.prototype.replaceAll`        |       Y        |      N       | `string.prototype.replaceall` |
| `Promise.any`                        |       Y        |      Y       | `promise.any`                 |
