import corejs3Entries from "../core-js-compat/entries";

import {
  BuiltIns,
  StaticProperties,
  InstanceProperties,
} from "../src/built-in-definitions.js";

const supportedCorejs3Modules = new Set();

const corejs3Modules = corejs3Entries["core-js"];

function addsupportedCorejs3Modules(descriptors) {
  for (const { global } of Object.values(descriptors)) {
    for (const dep of global) {
      supportedCorejs3Modules.add(dep);
    }
  }
}
addsupportedCorejs3Modules(BuiltIns);

for (const properties of Object.values(StaticProperties)) {
  addsupportedCorejs3Modules(properties);
}

addsupportedCorejs3Modules(InstanceProperties);

const allowList = [];
describe("corejs3 builtin definitions", () => {
  it("should support most corejs3 features", () => {
    let todoListItem = 0;
    for (const name of corejs3Modules) {
      if (supportedCorejs3Modules.has(name)) continue;
      if (name.startsWith("es.")) {
        const esNextName = "esnext." + name.slice(3);
        if (supportedCorejs3Modules.has(esNextName)) {
          todoListItem++;
          console.error(
            `Please replace "${esNextName}" by "${name}" in
packages/babel-plugin-polyfill-corejs3/src/built-in-definitions.js.`,
          );
          continue;
        }
      }
      if (name.startsWith("esnext.")) {
        const esName = "es." + name.slice(7);
        if (supportedCorejs3Modules.has(esName)) continue;
      }
      allowList.push(name);
    }
    expect(todoListItem).toBe(0);
    // The allowlist should only be added when we decide we don't support
    // the feature in `src/builtin-definitions.js`
    expect(allowList).toMatchInlineSnapshot(`
      Array [
        "es.symbol.match-all",
        "es.array.unscopables.flat",
        "es.date.get-year",
        "es.date.set-year",
        "es.date.to-gmt-string",
        "es.escape",
        "es.json.stringify",
        "es.reflect.to-string-tag",
        "es.regexp.dot-all",
        "es.regexp.sticky",
        "es.regexp.test",
        "es.string.substr",
        "es.unescape",
        "esnext.array.filter-out",
        "esnext.array.filter-reject",
        "esnext.array.group-by",
        "esnext.array.is-template-object",
        "esnext.array.unique-by",
        "esnext.async-iterator.constructor",
        "esnext.async-iterator.as-indexed-pairs",
        "esnext.async-iterator.drop",
        "esnext.async-iterator.every",
        "esnext.async-iterator.filter",
        "esnext.async-iterator.find",
        "esnext.async-iterator.flat-map",
        "esnext.async-iterator.for-each",
        "esnext.async-iterator.from",
        "esnext.async-iterator.map",
        "esnext.async-iterator.reduce",
        "esnext.async-iterator.some",
        "esnext.async-iterator.take",
        "esnext.async-iterator.to-array",
        "esnext.bigint.range",
        "esnext.iterator.constructor",
        "esnext.iterator.as-indexed-pairs",
        "esnext.iterator.drop",
        "esnext.iterator.every",
        "esnext.iterator.filter",
        "esnext.iterator.find",
        "esnext.iterator.flat-map",
        "esnext.iterator.for-each",
        "esnext.iterator.from",
        "esnext.iterator.map",
        "esnext.iterator.reduce",
        "esnext.iterator.some",
        "esnext.iterator.take",
        "esnext.iterator.to-array",
        "esnext.map.emplace",
        "esnext.map.update-or-insert",
        "esnext.map.upsert",
        "esnext.number.range",
        "esnext.object.iterate-entries",
        "esnext.object.iterate-keys",
        "esnext.object.iterate-values",
        "esnext.symbol.async-dispose",
        "esnext.symbol.matcher",
        "esnext.symbol.metadata",
        "esnext.symbol.replace-all",
        "esnext.typed-array.filter-out",
        "esnext.typed-array.filter-reject",
        "esnext.typed-array.find-last",
        "esnext.typed-array.find-last-index",
        "esnext.typed-array.group-by",
        "esnext.typed-array.unique-by",
        "esnext.weak-map.emplace",
        "esnext.weak-map.upsert",
      ]
    `);
  });
});
