# Babel Polyfills

This repository implements what was proposed in [babel/babel#10008](https://github.com/babel/babel/issues/10008).

Docs are in the `docs` folder.

After cloning this repo, run `yarn` to install dependencies and to run lerna.

---

In the last three years and a half, `@babel/preset-env` has shown its full potential in reducing bundle sizes not only by not transpiling supported syntax features, but also by not including unnecessary `core-js` polyfills.

So far Babel provided three different ways to inject `core-js` polyfills in the source code:

- By using `@babel/preset-env`'s `useBuiltIns: "entry"` option, it is possible to inject polyfills for every ECMAScript functionality not natively supported by the target browsers;
- By using `@babel/preset-env`'s `useBuiltIns: "usage"`, Babel will only inject polyfills for unsupported ECMAScript features but _only_ if they are actually used in the input souce code;
- By using `@babel/plugin-transform-runtime`, Babel will inject po<i>n</i>yfills (which are "pure" and don't pollute the global scope) for every used ECMAScript feature supported by `core-js`. This is usually used by library authors.
