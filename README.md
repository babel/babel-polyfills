# Babel Polyfills

A set of Babel plugins that enable injecting different polyfills with different strategies in your compiled code.
Additionally, this repository contains a package that helps with creating providers for other polyfills.

> ⚠️ These packages are highly experimental and not published yet. You can use GitHub's "Watch for Releases only" feature to be notified when the first version is published.

> ℹ️ This repository implements what was initially proposed at [babel/babel#10008](https://github.com/babel/babel/issues/10008).

> 💡 If you are looking for some quick setup examples, or just want to see how to migrate your config, please check [`docs/migration.md`](https://github.com/babel/babel-polyfills/blob/master/docs/migration.md).

## How does it work?

Polyfill plugins can expose three different injection methods: `entry-global`, `usage-global` and `usage-pure`.
Note that polyfill plugins don't automatically add the necessary package(s) to your dependencies, so you must explicitly list them in your `package.json`.

> ℹ️ All the examples assume that you are targeting Chrome 62.

- The `entry-global` method replaces a single simple import to the whole polyfill with imports to the specific features not supported by the target environments. It is most useful when you want to be sure that every unsupported function is available, regardless of what you are using in the code you are compiling with Babel. You might want to use this method if:

  1. you are not compiling your dependencies, but you want to be sure that they have all the necessary polyfills;
  1. Babel's detection logic isn't smart enough to understand which functions you are using;
  1. you want to have a single bundled file containing all the polyfills, without needing to regenerate it when your code changes.

    <!-- prettier-ignore-start -->
    <table>
    <thead><tr>
    <th align="center">Input code</th>
    <th align="center">Output code</th>
    </tr></thead>
    <tr>
    <td>
          
    ```js
    import "core-js";
    ```
    
    </td>
    <td>
    
    ```js
    import "core-js/modules/es7.array.flat-map.js";
    import "core-js/modules/es6.array.sort.js";
    import "core-js/modules/es7.promise.finally.js";
    import "core-js/modules/es7.symbol.async-iterator.js";
    import "core-js/modules/es7.string.trim-left.js";
    import "core-js/modules/es7.string.trim-right.js";
    import "core-js/modules/web.timers.js";
    import "core-js/modules/web.immediate.js";
    import "core-js/modules/web.dom.iterable.js";
    ```
    
    </td>
    </tr>
    </table>
    <!-- prettier-ignore-end -->

- The `usage-global` method injects imports to polyfills attached to the global scope, but only for unsupported features which are used in your code. You might want to use this method if:

  1. you need to keep your code size as small as possible, and only include what is used;
  1. your polyfill doesn't support a single entry point, but each of its features must be loaded separately.

    <!-- prettier-ignore-start -->
    <table>
    <thead><tr>
    <th align="center">Input code</th>
    <th align="center">Output code</th>
    </tr></thead>
    <tr>
    <td>
          
    ```js
    foo.flatMap(x => [x, x+1]);
    bar.trimLeft();
    arr.includes(2);
    ```
    
    </td>
    <td>
    
    ```js
    import "core-js/modules/es.array.flat-map.js";
    import "core-js/modules/es.array.unscopables.flat-map.js";
    import "core-js/modules/es.string.trim-start.js";
    
    foo.flatMap(x => [x, x + 1]);
    bar.trimLeft();
    arr.includes(2);
    ```
    
    </td>
    </tr>
    </table>
    <!-- prettier-ignore-end -->

- The `usage-pure` method injects imports to polyfills for unsupported features which are used in your code, without attaching the polyfills to the global scope but importing them as normal functions. You might want to use this method if:

  1. you are a library author, and don't want to "pollute" the global scope with the polyfills you are loading.

    <!-- prettier-ignore-start -->
    <table>
    <thead><tr>
    <th align="center">Input code</th>
    <th align="center">Output code</th>
    </tr></thead>
    <tr>
    <td>
          
    ```js
    foo.flatMap(x => [x, x+1]);
    bar.trimLeft();
    arr.includes(2);
    ```
    
    </td>
    <td>
    
    ```js
    import _flatMapInstanceProperty from "core-js-pure/stable/instance/flat-map.js";
    import _trimLeftInstanceProperty from "core-js-pure/stable/instance/trim-left.js";
    
    _flatMapInstanceProperty(foo).call(foo, x => [x, x + 1]);
    _trimLeftInstanceProperty(bar).call(bar);
    arr.includes(2);
    ```
    
    </td>
    </tr>
    </table>
    <!-- prettier-ignore-end -->

If you want to read more about the different options and supported features, you can read the [usage docs](./docs/usage.md)!

## What polyfills are supported?

<!--prettier-ignore -->
| Polyfill | Plugin | Methods |
| :------: | :----: | :-----: |
| `core-js@2` | [`babel-plugin-polyfill-corejs2`](./packages/babel-plugin-polyfill-corejs2) | `entry-global`, `usage-global` and `usage-pure` |
| `core-js@3` | [`babel-plugin-polyfill-corejs3`](./packages/babel-plugin-polyfill-corejs3) | `entry-global`, `usage-global` and `usage-pure` |
| `es-shims` | [`babel-plugin-polyfill-es-shims`](./packages/babel-plugin-polyfill-es-shims) | `usage-global` and `usage-pure` |
| `regenerator-runtime` | [`babel-plugin-polyfill-regenerator`](./packages/babel-plugin-polyfill-regenerator) | `entry-global`, `usage-global` and `usage-pure` |

If you want to implement support for a custom polyfill, you can use `@babel/helper-define-polyfill-provider`. ([docs](./docs/polyfill-provider.md))

## History and Motivation

In the last three years and a half, `@babel/preset-env` has shown its full potential in reducing bundle sizes not only by not transpiling supported syntax features, but also by not including unnecessary `core-js` polyfills.

So far Babel provided three different ways to inject `core-js` polyfills in the source code:

- By using `@babel/preset-env`'s `useBuiltIns: "entry"` option, it is possible to inject polyfills for every ECMAScript functionality not natively supported by the target browsers;
- By using `@babel/preset-env`'s `useBuiltIns: "usage"`, Babel will only inject polyfills for unsupported ECMAScript features but _only_ if they are actually used in the input souce code;
- By using `@babel/plugin-transform-runtime`, Babel will inject po<i>n</i>yfills (which are "pure" and don't pollute the global scope) for every used ECMAScript feature supported by `core-js`. This is usually used by library authors.

Our old approach has two main problems:

- It wasn't possible to use `@babel/preset-env`'s `targets` option with "pure" po<i>n</i>fylls, because `@babel/plugin-transform-runtime` is a completely separate package.
- We forced our users to use `core-js` if they wanted a Babel integration. `core-js` is a good and comprhensive polyfill, but it doesn't fit the needs of all of our users.

With this new packages we are proposing a solution for both of these problem, while still maintaining full backward compatibility.
