// @flow

import { types as t } from "@babel/core";
import type { NodePath } from "@babel/traverse";

type StrMap<K> = Map<string, K>;

export default class ImportsCache {
  _imports: WeakMap<NodePath, StrMap<string>>;
  _lastImports: WeakMap<NodePath, NodePath>;

  constructor() {
    this._imports = new WeakMap();
    this._lastImports = new WeakMap();
  }

  store(
    programPath: NodePath,
    url: string,
    name: string,
    getVal: (
      isScript: boolean,
      source: t.StringLiteral,
      name: t.Identifier,
    ) => { node: t.Node, name: string },
  ) {
    const key = this._normalizeKey(programPath, url, name);
    const imports = this._ensure(this._imports, programPath);

    if (!imports.has(key)) {
      const { node, name: id } = getVal(
        programPath.node.sourceType === "script",
        t.stringLiteral(url),
        t.identifier(name),
      );
      imports.set(key, id);

      let lastImport = this._lastImports.get(programPath);
      if (lastImport && lastImport.node) {
        lastImport = lastImport.insertAfter(node);
      } else {
        lastImport = programPath.unshiftContainer("body", node);
      }
      lastImport = lastImport[lastImport.length - 1];
      this._lastImports.set(programPath, lastImport);
    }

    return t.identifier(imports.get(key));
  }

  _ensure(map: Map<*, *> | WeakMap<*, *>, programPath: NodePath): * {
    if (!map.has(programPath)) map.set(programPath, new Map());
    return map.get(programPath);
  }

  _normalizeKey(programPath: NodePath, url: string, name: string): string {
    return `${programPath.node.sourceType}::${url}::${name}`;
  }
}
