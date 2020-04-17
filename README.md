# Babel Polyfills

A set of Babel plugins that enable injecting different polyfills with different strategies in your compiled code.
Additionally, this reporitory contains a package that helps creating providers for any other polyfill.

> ⚠️ These packages are highly experimental and not published yet.

## History and Motivation

In the last three years and a half, `@babel/preset-env` has shown its full potential in reducing bundle sizes not only by not transpiling supported syntax features, but also by not including unnecessary `core-js` polyfills.

So far Babel provided three different ways to inject `core-js` polyfills in the source code:

- By using `@babel/preset-env`'s `useBuiltIns: "entry"` option, it is possible to inject polyfills for every ECMAScript functionality not natively supported by the target browsers;
- By using `@babel/preset-env`'s `useBuiltIns: "usage"`, Babel will only inject polyfills for unsupported ECMAScript features but _only_ if they are actually used in the input souce code;
- By using `@babel/plugin-transform-runtime`, Babel will inject po<i>n</i>yfills (which are "pure" and don't pollute the global scope) for every used ECMAScript feature supported by `core-js`. This is usually used by library authors.

Our old approach has two main problems:

- It wasn't possible to use `@babel/preset-env`'s `targets` option with "pure" po<i>n</i>fylls, because `@babel/plugin-transform-runtime` is a completely separated package.
- We forced our users to use `core-js` if they wanted a Babel integration. `core-js` is a good and comprhensive polyfill, but it doesn't fit the needs of all of our users.

With this new packages we are proposing a solution for both of these problem, while still maintaining full backward compatibility.
