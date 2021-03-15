// @flow

import type NodePath from "@babel/traverse";
import type { Utils } from "./types";
import type ImportsCache from "./imports-cache";

import * as _babel from "@babel/core";
let babel = _babel;
if (babel.default) babel = babel.default;
const { types: t, template } = babel;

export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set();
  a.forEach(v => b.has(v) && result.add(v));
  return result;
}

export function has(object: Object, key: string) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function getType(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1);
}

function resolveId(path) {
  if (
    path.isIdentifier() &&
    !path.scope.hasBinding(path.node.name, /* noGlobals */ true)
  ) {
    return path.node.name;
  }

  const { deopt } = path.evaluate();
  if (deopt && deopt.isIdentifier()) {
    return deopt.node.name;
  }
}

export function resolveKey(path: NodePath, computed: boolean = false) {
  const { node, parent, scope } = path;
  if (path.isStringLiteral()) return node.value;
  const { name } = node;
  const isIdentifier = path.isIdentifier();
  if (isIdentifier && !(computed || parent.computed)) return name;

  if (
    computed &&
    path.isMemberExpression() &&
    path.get("object").isIdentifier({ name: "Symbol" }) &&
    !scope.hasBinding("Symbol", /* noGlobals */ true)
  ) {
    const sym = resolveKey(path.get("property"), path.node.computed);
    if (sym) return "Symbol." + sym;
  }

  if (!isIdentifier || scope.hasBinding(name, /* noGlobals */ true)) {
    const { value } = path.evaluate();
    if (typeof value === "string") return value;
  }
}

export function resolveSource(obj: NodePath) {
  if (
    obj.isMemberExpression() &&
    obj.get("property").isIdentifier({ name: "prototype" })
  ) {
    const id = resolveId(obj.get("object"));

    if (id) {
      return { id, placement: "prototype" };
    }
    return { id: null, placement: null };
  }

  const id = resolveId(obj);
  if (id) {
    return { id, placement: "static" };
  }

  const { value } = obj.evaluate();
  if (value !== undefined) {
    return { id: getType(value), placement: "prototype" };
  } else if (obj.isRegExpLiteral()) {
    return { id: "RegExp", placement: "prototype" };
  } else if (obj.isFunction()) {
    return { id: "Function", placement: "prototype" };
  }

  return { id: null, placement: null };
}

export function getImportSource({ node }: NodePath) {
  if (node.specifiers.length === 0) return node.source.value;
}

export function getRequireSource({ node }: NodePath) {
  if (!t.isExpressionStatement(node)) return;
  const { expression } = node;
  const isRequire =
    t.isCallExpression(expression) &&
    t.isIdentifier(expression.callee) &&
    expression.callee.name === "require" &&
    expression.arguments.length === 1 &&
    t.isStringLiteral(expression.arguments[0]);
  if (isRequire) return expression.arguments[0].value;
}

function hoist(node: t.Node) {
  node._blockHoist = 3;
  return node;
}

export function createUtilsGetter(cache: ImportsCache) {
  return (path: NodePath): Utils => {
    const prog = path.findParent(p => p.isProgram());

    return {
      injectGlobalImport(url) {
        cache.storeAnonymous(prog, url, (isScript, source) => {
          return isScript
            ? template.statement.ast`require(${source})`
            : t.importDeclaration([], source);
        });
      },
      injectNamedImport(url, name, hint = name) {
        return cache.storeNamed(prog, url, name, (isScript, source, name) => {
          const id = prog.scope.generateUidIdentifier(hint);
          return {
            node: isScript
              ? hoist(template.statement.ast`
                  var ${id} = require(${source}).${name}
                `)
              : t.importDeclaration([t.importSpecifier(id, name)], source),
            name: id.name,
          };
        });
      },
      injectDefaultImport(url, hint = url) {
        return cache.storeNamed(prog, url, "default", (isScript, source) => {
          const id = prog.scope.generateUidIdentifier(hint);
          return {
            node: isScript
              ? hoist(template.statement.ast`var ${id} = require(${source})`)
              : t.importDeclaration([t.importDefaultSpecifier(id)], source),
            name: id.name,
          };
        });
      },
    };
  };
}
