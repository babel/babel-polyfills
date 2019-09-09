_"Polyfill providers"_ are the packages which `@babel/plugin-inject-polyfills` delegates to.
Their job is to provide the correct import paths for every functionality that their underling polyfill can handle.

A _"polyfill provider"_ is a normal JavaScript function, similarly to how Babel plugins are defined. It takes two parameters (`api` and `options`) and returns an object with the provider implementation.

```ts
function polyfillProvider(api: ProviderApi, options: Options): Provider;
```

### The `Provider` result object.

The provider object exposes different properties and methods:

#### `provider.name: string`

It's the name of the polyfill providers, similarly Babel plugins' `name` property. It's mostly used when the `debug` option is enabled, and in error messages.

```js
function myProvider(api) {
  return {
    name: "my-polyfill",
    // ...
  };
}
```

#### `provider.polyfills: string[] | { [name: string]: Support }`

Is the list of polyfills supported by the polyfill provider. The names don't have a predefined format, but it's important that you are consistent. For example, `core-js` always uses `es.OBJECT.METHOD`, like in `es.array.includes`.
These names will be used for two main purpuses to automatically validate and apply the `include` and `exclude` options specified by the user.
If you use the recommended object version of this option, you can specify which browsers natively support the feature provided by the polyfill: this will make your provider support the `target` option of `@babel/plugin-inject-polyfills`.

```js
function myProvider(api) {
  return {
    // ...
    polyfills: {
      "es.array.from": { chrome: "51", firefox: "53", node: "6.5" },
      "es.array.includes": { chrome: "53", firefox: "48", node: "7.0" },
    },
  };
}
```

#### `provider.filterPolyfills: (name: string) => boolean`

Sometimes you might want to conditionally include a polyfill based on some additional options that your provider takes.
For example, you might want to only inlcude some non compliant shams if the `sham: true` option is enabled.

This is similar to directly filtering the `polyfills` option, but it is applied _after_ validating the `include` and `exclude` options. Since only polyfills defined with `polyfills` can be used in those option, `filterPolyfills` prevents errors in case someone is excluding a polyfill which would be excluded by this method anyway.

```js
function myProvider(api, options) {
  return {
    // ...
    polyfills: ["Object.assign", "Object.create"],
    filterPolyfills(name) {
      if (name === "Object.create" && !options.sham) return false;
      return true;
    },
  };
}
```

#### `provider.entryGlobal`, `provider.usageGlobal` and `provider.usagePure`

These three functions are the core of any polyfill provider.
They correspond, respectively, to the `entry-global`, `usage-global` and `usage-pure` values of the `method` option of `@babel/plugin-inject-polyfills`.
They are all optional, but you must specify at least one of them.

They take three parameters, and return nothing:

```js
function entryGlobal(meta, utils, path): void;
```

The first parameter represents the metadata of the function or property `@babel/plugin-inject-polyfills` is asking a polyfill for.
...

#### `provider.visitor`

If a provider needs to handle special cases which aren't supported by `@babel/plugin-inject-polyfills`, it can provide a normal `visitor` like any Babel plugin.

### meta

A `meta` object describes the statement or expression which triggered the call to the polyfill provider. It always has a `kind` property which can be used to differentiate between the possible polyfill types.

- ```js
   import "my-polyfill"`;
  ```

  ```js
  type Meta = { kind: "import", source: string };
  ```

  This can only happen when using `method: "entry-global"`. It is needed to replace the generic entry point of the plugin with the optimized entry points based on the targets.

- ```js
  Promise;
  ```

  ```js
  type Meta = { kind: "global", name: string };
  ```

  Where, in this example, `name` is `"Promise"`

- ```js
  obj.prop;
  ```

  ```js
  type Meta = {
    kind: "property",
    placement: "static" | "prototype" | null,
    object: string | null,
    key: string,
  };
  ```

  `@babel/plugin-inject-polyfill` tries to detect the origin of `obj`, to infer the property placement and the real name of `obj`.

  - If `obj` is a global binding not declared in the current file, `obj.prop` is assumed to be a static property of a built-in object:

    ```js
    Array.from;
    ```

    ```js
    type Meta = {
      kind: "property",
      placement: "static",
      object: "Array",
      key: "from",
    };
    ```

    Note that `@babel/plugin-inject-polyfills` will also track assignments as much as possible. For example, this code is represented by the same `Meta`:

    ```js
    var MyArray = Array;
    var propName = "from";

    MyArray[propName];
    ```

  - If `obj` can be inferred to be a native JS type (e.g. an array), or it comes from a `Something.prototype` access, it is considered a prototype property:

    ```js
    [].includes;
    ```

    ```js
    type Meta = {
      kind: "property",
      placement: "prototype",
      object: "Array",
      key: "includes",
    };
    ```

  - If it isn't possible to detect where `obj` comes from, for example when it is generated by a complex expression, both `placement` and `obj` are set to `null`:

    ```js
    getThing().includes;
    ```

    ```js
    type Meta = {
      kind: "property",
      placement: null,
      object: null,
      key: "includes",
    };
    ```

  The `"property"` kind is also used when destructuring, for example in `{ from } = Array`.

  `Symbol.*` property names are considered as an unit. For example, in `Array.prototype[Symbol.iterator]`, `meta.key` is `"Symbol.iterator"`.

- ```js
  Symbol.iterator in [];
  ```

  Many dynamic checks for the presence of a polyfilled property can be statically replaced. For example, an "is iterable" check could be statically replaced with a functions which checks if the lhs is an array, `arguments`, or any other polyfilled built-in which should be handled as if it was iterable.

  ```js
  type Meta = {
    kind: "in",
    placement: ?("static" | "prototype"),
    object: ?string,
    key: string,
  };
  ```

  It follows the same rules as the `"property"` kind.

### utils

### api

### createMetaResolver
