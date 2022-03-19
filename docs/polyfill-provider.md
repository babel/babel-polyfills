_"Polyfill providers"_ are the packages which contain the actual polyfills data.
Their job is to provide the correct import paths for every functionality that their underling polyfill can handle.

> You can find some examples in the [`packages`](https://github.com/nicolo-ribaudo/babel-polyfills/tree/main/packages) folder of this repository

A _"polyfill provider"_ is defined passing a factory function to `@babel/helper-define-polyfill-provider`. The factory function takes two parameters (`api` and `options`) and returns an object with the provider implementation.

```ts
function polyfillProvider(api: ProviderApi, options: Options): Provider;
```

## The `Provider` result object.

The provider object exposes different properties and methods:

### `provider.name: string`

It's the name of the polyfill providers, similarly Babel plugins' `name` property. It's mostly used when the `debug` option is enabled, and in error messages.

```js
function myProvider(api) {
  return {
    name: "my-polyfill",
    // ...
  };
}
```

### `provider.polyfills: string[] | { [name: string]: Support }`

Is the list of polyfills supported by the polyfill provider. The names don't have a predefined format, but it's important that you are consistent. For example, `core-js` always uses `es.OBJECT.METHOD`, like in `es.array.includes`.
These names will be used for two main purpuses to automatically validate and apply the `include` and `exclude` options specified by the user.
If you use the recommended object version of this option, you can specify which browsers natively support the feature provided by the polyfill: this will make your provider support the `target` option of `@babel/helper-define-polyfill-provider`.

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

### `provider.filterPolyfills: (name: string) => boolean`

Sometimes you might want to conditionally include a polyfill based on some additional options that your provider takes.
For example, you might want to only include some non compliant shams if the `sham: true` option is enabled.

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

### `provider.visitor`

If a provider needs to handle special cases which aren't supported by `@babel/helper-define-polyfill-provider`, it can provide a normal `visitor` like any Babel plugin.

### `provider.entryGlobal`, `provider.usageGlobal` and `provider.usagePure`

These three functions are the core of any polyfill provider.
They correspond, respectively, to the `entry-global`, `usage-global` and `usage-pure` values of the `method` option of `@babel/helper-define-polyfill-provider`.
They are all optional, but you must specify at least one of them.

They take three parameters, and return nothing:

```js
function entryGlobal(meta, utils, path): void;
```

#### `meta`

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

    Note that `@babel/helper-define-polyfill-provider` will also track assignments as much as possible. For example, this code is represented by the same `Meta`:

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

#### `utils`

When calling a provider function (e.g. `usageGlobal`), `@babel/helper-define-polyfill-provider` will provide it a few utilities to easily inject the necessary `import` statements or `require` calls, depending on the source type. Polyfill providers shouldn't worry about which AST represents an import, or about the source type of the file being transpiled.

- `utils.injectGlobalImport(url: string)` can be used to inject side-effectful global imports. It is usually called when injecting global polyfills.
  For example, `utils.injectGlobalImport("my-polyfill")` would generate this code:

  ```js
  import "my-polyfill";
  ```

- `utils.injectNamedImport(url: string, name: string, hint?: string)` and `utils.injectDefaultImport(url: string, hint?: string)` are used to inject named or defaults import. They both return an identifier referencing the imported value.
  The optional `hint` parameter can be used to generate a nice-looking alias for the import.
  For example, `utils.injectNamedImport("array-polyfills", "from, "Array.from")` would generate this code:

  ```js
  import { from as _ArrayFrom } from "array-polyfills";
  ```

  and return this AST node:

  ```json
  {
    "type": "Identifier",
    "name": "_ArrayFrom"
  }
  ```

## The `ProviderApi` parameter

While some utilities are provided in the `utils` object, some of them are provided in the `api` object. The main different is that `utils` methods act on a specific input source file, while `api` methods provide info about how the plugin was configured and are not directly related to the transformed source code.

### `api.method`

It represents the `method` option passed to `@babel/helper-define-polyfill-provider`, and it can be one of `"entry-global"`, `"usage-global"`, or `"usage-pure"`.

### `api.targets`

It represents the resolved engines which the user is targeting. Regardless of how they were specified (i.e. via browserslist), they are always normalized to an object mapping from engine names to versions.

Example:

```json
{
  "chrome": "74.0.0",
  "firefox": "67.0.0",
  "ios": "12.2.0"
}
```

### `api.shouldInjectPolyfill(name: string): boolean`

This methods returns wether or not a polyfill is needed, using data from the `targets`, `include` and `exclude` options, and from the engines support specified in the `provider.polyfills` property returned by the polyfill provider.

### `api.debug(name: string | null)`

This method is used to log information about the injected polyfills, which will then be reported to the user if the `debug` option is enabled.

It should be called passing the polyfill name as a string whenever a polyfill is injected. When, in `"entry-global"` mode, the polyfill entry point has been found but removed becase no polyfill was needed, this method should be called passing `null` as a parameter to indicate that nothing has been injected.

### `api.assertDependency(name: string, version?: string)`

This method is used to verify that a polyfill package that is going to be used is installed. If it's not installed, it will log a message asking the user to install it.

### `api.getUtils(path: NodePath): Utils`

Sometimes you might need to inject an import outside of the `entryGlobal`/`usageGlobal`/`usagePure` methods. You could manually create the AST representing it, after checking which source type the current file is using (if `script` or `module`), but it is way more complex than the out-of-the-box support provided by the `utils` object.

You can use this method to create a new `utils` object with all its utilities, attached to the file the current `NodePath` belongs to.

```js
export default function({ getUtils }) {
  return {
    // ...
    visitor: {
      YieldExpression(path) {
        if (!path.node.star) return;
        getUtils(path).injectGlobalImport("iterators-polyfill");
      },
    },
  };
}
```

### `api.createMetaResolver`

```js
function createMetaResolver<T>(definitions: Definitions<T>): (meta: Meta) => T;
```

From a syntactic point of view, `window.Promise` is a static property access: we are accessing the `"Promise"` property of the `window` object. For this reason, when polyfilling the ES2015 `Promise` constructor, we need to check both for static properties and for global variables.
Following the same pattern, `theFoo.includes` has the same problem: it could be a static property access on the `theFoo` global object, or `theFoo` could be a global instance of an array and `includes` would then be a prototype property.

To avoid having to manually check for all these cases, the `createMetaResolver` factory creates a function which does it for you.

The `definitions` parameter is an object containing mappings of global values, and of static and instance properties. It has the following shape:

```js
type Definitions<T> = {
  global: {
    [variableName: string]: T,
  },
  instance: {
    [propertyName: string]: T,
  },
  static: {
    [objectName: string]: {
      [propertyName: string]: T,
    },
  },
};
```

Instance properties aren't categorized by their object, because often it's not possible to statically determine it.
For this reason, it is highly recommended that pure polyfills for instance properties, if supported, check their argument type at runtime.
For example, a `*.includes` polyfill might look like this:

```js
import * as array from "array-methods";
import * as string from "string-methods";

export default includes(thisValue, value) {
  if (typeof thisValue === "string") {
    return string.includes(thisValue, value);
  }
  if (Array.isArray(thisValue)) {
    return array.includes(thisValue, value);
  }

  // This is not an array or a string, so we call the original method
  return arr.includes(value);
}
```

## Naming convention

Polyfill providers follow a naming convention similar to Babel plugins and presets:

- `@babel/plugin-polyfill-POLYFILL-NAME`
- `@ORG/babel-plugin-polyfill-POLYFILL-NAME`
- `@ORG/babel-plugin-polyfill`
