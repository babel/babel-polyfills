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

| Builtin object or function    | Package name                                                                             |
| :---------------------------- | :--------------------------------------------------------------------------------------- |
| `Array.prototype.every`       | [`array.prototype.every`](https://github.com/es-shims/Array.prototype.every)             |
| `Array.prototype.indexOf`     | [`array.prototype.indexof`](https://github.com/es-shims/Array.prototype.indexOf)         |
| `Array.prototype.lastIndexOf` | [`array.prototype.lastindexof`](https://github.com/es-shims/Array.prototype.lastIndexOf) |
| `Array.prototype.map`         | [`array.prototype.map`](https://github.com/es-shims/Array.prototype.map)                 |
| `Array.prototype.reduce`      | [`array.prototype.reduce`](https://github.com/es-shims/Array.prototype.reduce)           |
| `Array.prototype.reduceRight` | [`array.prototype.reduceright`](https://github.com/es-shims/Array.prototype.reduceRight) |
| `Array.prototype.some`        | [`array.prototype.some`](https://github.com/es-shims/Array.prototype.some)               |

### ES2015 (ES6)

| Builtin object or function  | Package name                                                                          |
| :-------------------------- | :------------------------------------------------------------------------------------ |
| `Array.from`                | [`array.from`](https://github.com/mathiasbynens/Array.from)                           |
| `Array.of`                  | [`array.of`](https://github.com/mathiasbynens/Array.of)                               |
| `Array.prototype.find`      | [`array.prototype.find`](https://github.com/paulmillr/Array.prototype.find)           |
| `Array.prototype.findIndex` | [`array.prototype.findindex`](https://github.com/paulmillr/Array.prototype.findIndex) |
| `Array.prototype.keys`      | [`array.prototype.keys`](https://github.com/es-shims/Array.prototype.keys)            |
| `Array.prototype.values`    | [`array.prototype.values`](https://github.com/es-shims/Array.prototype.values)        |
| `Function.prototype.name`   | [`function.prototype.name`](https://github.com/es-shims/Function.prototype.name)      |
| `Number.isNaN`              | [`is-nan`](https://github.com/es-shims/is-nan)                                        |
| `Object.asskgin`            | [`object.assign`](https://github.com/ljharb/object.assign)                            |
| `Reflect.ownKeys`           | [`reflect.ownkeys`](https://github.com/es-shims/Reflect.ownKeys)                      |
| `RegExp.prototype.flags`    | [`regexp.prototype.flags`](https://github.com/es-shims/RegExp.prototype.flags)        |

### ES2016

| Builtin object or function | Package name                                                   |
| :------------------------- | :------------------------------------------------------------- |
| `Array.prototype.includes` | [`array-includes`](https://github.com/es-shims/array-includes) |

### ES2017

| Builtin object or function         | Package name                                                                                       |
| :--------------------------------- | :------------------------------------------------------------------------------------------------- |
| `Object.values`                    | [`object.values`](https://github.com/es-shims/Object.values)                                       |
| `Object.entries`                   | [`object.entries`](https://github.com/es-shims/Object.entries)                                     |
| `Object.getOwnPropertyDescriptors` | [`object.getownpropertydescriptors`](https://github.com/es-shims/object.getownpropertydescriptors) |
| `String.prototype.padStart`        | [`string.prototype.padstart`](https://github.com/es-shims/String.prototype.padStart)               |
| `String.prototype.padEnd`          | [`string.prototype.padend`](https://github.com/es-shims/String.prototype.padEnd)                   |

### ES2018

| Builtin object or function  | Package name                                                                         |
| :-------------------------- | :----------------------------------------------------------------------------------- |
| `Promise.prototype.finally` | [`promise.prototype.finally`](https://github.com/es-shims/Promise.prototype.finally) |

### ES2019

| Builtin object or function     | Package name                                                                               |
| :----------------------------- | :----------------------------------------------------------------------------------------- |
| `Array.prototype.flat`         | [`array.prototype.flat`](https://github.com/es-shims/Array.prototype.flat)                 |
| `Array.prototype.flatMap`      | [`array.prototype.flatmap`](https://github.com/es-shims/Array.prototype.flatMap)           |
| `Object.fromEntries`           | [`object.fromentries`](https://github.com/es-shims/Object.fromEntries)                     |
| `String.prototype.trimStart`   | [`string.prototype.trimstart`](https://github.com/es-shims/String.prototype.trimStart)     |
| `String.prototype.trimEnd`     | [`string.prototype.trimend`](https://github.com/es-shims/String.prototype.trimEnd)         |
| `String.prototype.trimLeft`    | [`string.prototype.trimleft`](https://github.com/es-shims/String.prototype.trimLeft)       |
| `String.prototype.trimRight`   | [`string.prototype.trimright`](https://github.com/es-shims/String.prototype.trimRight)     |
| `Symbol.prototype.description` | [`symbol.prototype.description`](https://github.com/es-shims/Symbol.prototype.description) |

### ES2020

| Builtin object or function  | Package name                                                                       |
| :-------------------------- | :--------------------------------------------------------------------------------- |
| `globalThis`                | [`globalthis`](https://github.com/es-shims/globalThis)                             |
| `Promise.allSettled`        | [`promise.allsettled`](https://github.com/es-shims/Promise.allSettled)             |
| `String.prototype.matchAll` | [`string.prototype.matchall`](https://github.com/ljharb/String.prototype.matchAll) |

### Stage 3

| Builtin object or function           | Package name                                                                             |
| :----------------------------------- | :--------------------------------------------------------------------------------------- |
| `AggregateError` (for `Promise.any`) | [`es-aggregate-error`](https://github.com/es-shims/AggregateError)                       |
| `String.prototype.replaceAll`        | [`string.prototype.replaceall`](https://github.com/es-shims/String.prototype.replaceAll) |
| `Promise.any`                        | [`promise.any`](https://github.com/es-shims/Promise.any)                                 |
