import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";

type StrMap<K> = Map<string, K>;

export default class ImportsCache {
  _imports: WeakMap<NodePath<t.Program>, StrMap<string>>;
  _anonymousImports: WeakMap<NodePath<t.Program>, Set<string>>;
  _lastImports: WeakMap<NodePath<t.Program>, NodePath<t.Node>>;
  _resolver: (url: string) => string;

  constructor(resolver: (url: string) => string) {
    this._imports = new WeakMap();
    this._anonymousImports = new WeakMap();
    this._lastImports = new WeakMap();
    this._resolver = resolver;
  }

  storeAnonymous(
    programPath: NodePath<t.Program>,
    url: string,
    // eslint-disable-next-line no-undef
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
    this._injectImport(programPath, node);
  }

  storeNamed(
    programPath: NodePath<t.Program>,
    url: string,
    name: string,
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
      this._injectImport(programPath, node);
    }

    return t.identifier(imports.get(key));
  }

  _injectImport(programPath: NodePath<t.Program>, node: t.Node) {
    const lastImport = this._lastImports.get(programPath);
    let newNodes: [NodePath];
    if (
      lastImport &&
      lastImport.node &&
      // Sometimes the AST is modified and the "last import"
      // we have has been replaced
      lastImport.parent === programPath.node &&
      lastImport.container === programPath.node.body
    ) {
      newNodes = lastImport.insertAfter(node);
    } else {
      newNodes = programPath.unshiftContainer("body", node);
    }
    const newNode = newNodes[newNodes.length - 1];
    this._lastImports.set(programPath, newNode);

    /*
    let lastImport;

    programPath.get("body").forEach(path => {
      if (path.isImportDeclaration()) lastImport = path;
      if (
        path.isExpressionStatement() &&
        isRequireCall(path.get("expression"))
      ) {
        lastImport = path;
      }
      if (
        path.isVariableDeclaration() &&
        path.get("declarations").length === 1 &&
        (isRequireCall(path.get("declarations.0.init")) ||
          (path.get("declarations.0.init").isMemberExpression() &&
            isRequireCall(path.get("declarations.0.init.object"))))
      ) {
        lastImport = path;
      }
    });*/
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
