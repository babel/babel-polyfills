import { types as t } from "@babel/core";

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

export function resolveKey(path, computed) {
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

export function resolveSource(obj) {
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
