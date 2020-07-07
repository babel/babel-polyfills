// @flow

import { types as t } from "@babel/core";
import type { NodePath } from "@babel/traverse";

type StrMap<K> = Map<string, K>;

export default class ImportsCache {
  _imports: WeakMap<NodePath, StrMap<string>>;
  _anonymousImports: WeakMap<NodePath, Set<string>>;
  _lastImports: WeakMap<NodePath, NodePath>;

  constructor() {
    this._imports = new WeakMap();
    this._anonymousImports = new WeakMap();
    this._lastImports = new WeakMap();
  }

  storeAnonymous(
    programPath: NodePath,
    url: string,
    getVal: (isScript: boolean, source: t.StringLiteral) => t.Node,
  ) {
    const key = this._normalizeKey(programPath, url, "");
    const imports = this._ensure(this._anonymousImports, programPath, Set);

    if (imports.has(key)) return;

    const node = getVal(
      programPath.node.sourceType === "script",
      t.stringLiteral(url),
    );
    imports.add(key);
    this._injectImport(programPath, node);
  }

  storeNamed(
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
    const imports = this._ensure(this._imports, programPath, Map);

    if (!imports.has(key)) {
      const { node, name: id } = getVal(
        programPath.node.sourceType === "script",
        t.stringLiteral(url),
        t.identifier(name),
      );
      imports.set(key, id);
      this._injectImport(programPath, node);
    }

    return t.identifier(imports.get(key));
  }

  _injectImport(programPath: NodePath, node: t.Node) {
    let lastImport = this._lastImports.get(programPath);
    if (lastImport && lastImport.node) {
      lastImport = lastImport.insertAfter(node);
    } else {
      lastImport = programPath.unshiftContainer("body", node);
    }
    lastImport = lastImport[lastImport.length - 1];
    this._lastImports.set(programPath, lastImport);
  }

  _ensure<C: Map<*, *> | Set<*>>(
    map: WeakMap<NodePath, C>,
    programPath: NodePath,
    Collection: Class<C>,
  ): C {
    let collection = map.get(programPath);
    if (!collection) {
      collection = new Collection();
      map.set(programPath, collection);
    }
    return collection;
  }

  _normalizeKey(programPath: NodePath, url: string, name: string): string {
    return `${programPath.node.sourceType}::${url}::${name}`;
  }
}
