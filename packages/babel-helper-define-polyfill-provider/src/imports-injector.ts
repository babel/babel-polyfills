import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

type StrMap<K> = Map<string, K>;

export default class ImportsCachedInjector {
  _imports: WeakMap<NodePath<t.Program>, StrMap<string>>;
  _anonymousImports: WeakMap<NodePath<t.Program>, Set<string>>;
  _lastImports: WeakMap<
    NodePath<t.Program>,
    Array<{ path: NodePath<t.Node>; index: number }>
  >;
  _resolver: (url: string) => string;
  _getPreferredIndex: (url: string) => number;

  constructor(
    resolver: (url: string) => string,
    getPreferredIndex: (url: string) => number,
  ) {
    this._imports = new WeakMap();
    this._anonymousImports = new WeakMap();
    this._lastImports = new WeakMap();
    this._resolver = resolver;
    this._getPreferredIndex = getPreferredIndex;
  }

  storeAnonymous(
    programPath: NodePath<t.Program>,
    url: string,
    moduleName: string,
    getVal: (isScript: boolean, source: t.StringLiteral) => t.Node,
  ) {
    const key = this._normalizeKey(programPath, url);
    const imports = this._ensure<Set<string>>(
      this._anonymousImports,
      programPath,
      Set,
    );

    if (imports.has(key)) return;

    const node = getVal(
      programPath.node.sourceType === "script",
      t.stringLiteral(this._resolver(url)),
    );
    imports.add(key);
    this._injectImport(programPath, node, moduleName);
  }

  storeNamed(
    programPath: NodePath<t.Program>,
    url: string,
    name: string,
    moduleName: string,
    getVal: (
      isScript: boolean,
      // eslint-disable-next-line no-undef
      source: t.StringLiteral,
      // eslint-disable-next-line no-undef
      name: t.Identifier,
    ) => { node: t.Node; name: string },
  ) {
    const key = this._normalizeKey(programPath, url, name);
    const imports = this._ensure<Map<string, any>>(
      this._imports,
      programPath,
      Map,
    );

    if (!imports.has(key)) {
      const { node, name: id } = getVal(
        programPath.node.sourceType === "script",
        t.stringLiteral(this._resolver(url)),
        t.identifier(name),
      );
      imports.set(key, id);
      this._injectImport(programPath, node, moduleName);
    }

    return t.identifier(imports.get(key));
  }

  _injectImport(
    programPath: NodePath<t.Program>,
    node: t.Node,
    moduleName: string,
  ) {
    const newIndex = this._getPreferredIndex(moduleName);
    const lastImports = this._lastImports.get(programPath) ?? [];

    const isPathStillValid = (path: NodePath) =>
      path.node &&
      // Sometimes the AST is modified and the "last import"
      // we have has been replaced
      path.parent === programPath.node &&
      path.container === programPath.node.body;

    let last: NodePath;

    if (newIndex === Infinity) {
      // Fast path: we can always just insert at the end if newIndex is `Infinity`
      if (lastImports.length > 0) {
        last = lastImports[lastImports.length - 1].path;
        if (!isPathStillValid(last)) last = undefined;
      }
    } else {
      for (const [i, data] of lastImports.entries()) {
        const { path, index } = data;
        if (isPathStillValid(path)) {
          if (newIndex < index) {
            const [newPath] = path.insertBefore(node);
            lastImports.splice(i, 0, { path: newPath, index: newIndex });
            return;
          }
          last = path;
        }
      }
    }

    if (last) {
      const [newPath] = last.insertAfter(node);
      lastImports.push({ path: newPath, index: newIndex });
    } else {
      const [newPath] = programPath.unshiftContainer("body", node);
      this._lastImports.set(programPath, [{ path: newPath, index: newIndex }]);
    }
  }

  _ensure<C extends Map<string, any> | Set<string>>(
    map: WeakMap<NodePath<t.Program>, C>,
    programPath: NodePath<t.Program>,
    Collection: { new (...args: any): C },
  ): C {
    let collection = map.get(programPath);
    if (!collection) {
      collection = new Collection();
      map.set(programPath, collection);
    }
    return collection;
  }

  _normalizeKey(
    programPath: NodePath<t.Program>,
    url: string,
    name: string = "",
  ): string {
    const { sourceType } = programPath.node;

    // If we rely on the imported binding (the "name" parameter), we also need to cache
    // based on the sourceType. This is because the module transforms change the names
    // of the import variables.
    return `${name && sourceType}::${url}::${name}`;
  }
}
