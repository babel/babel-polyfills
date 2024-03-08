import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";
import type { MetaDescriptor } from "../types";

import { resolveKey, resolveSource } from "../utils";

export default (
  callProvider: (payload: MetaDescriptor, path: NodePath) => void,
) => {
  function property(object, key, placement, path) {
    return callProvider({ kind: "property", object, key, placement }, path);
  }

  const polyfilled = new WeakSet();
  function maybeMark(path: NodePath, oldNode: t.Node) {
    // Avoid Instance Properties
    if (path.node !== oldNode && !path.isCallExpression()) {
      polyfilled.add(path.node);
    }
  }

  return {
    LogicalExpression: {
      exit(path: NodePath<t.LogicalExpression>) {
        const { node } = path;
        if (node.operator !== "||") return;
        if (polyfilled.has(node.left)) {
          path.get("right").remove();
        } else if (
          t.isUnaryExpression(node.left) &&
          node.left.operator === "!" &&
          polyfilled.has(node.left.argument)
        ) {
          path.replaceWith(node.right);
        }
      },
    },
    IfStatement: {
      exit(path: NodePath<t.IfStatement>) {
        const { node } = path;
        if (polyfilled.has(node.test)) {
          path.replaceWith(node.consequent);
        } else if (
          t.isUnaryExpression(node.test) &&
          node.test.operator === "!"
        ) {
          if (polyfilled.has(node.test.argument)) {
            path.replaceWith(node.alternate);
          }
        }
      },
    },
    ConditionalExpression: {
      exit(path: NodePath<t.ConditionalExpression>) {
        const { node } = path;
        if (polyfilled.has(node.test)) {
          path.replaceWith(node.consequent);
        } else if (
          t.isUnaryExpression(node.test) &&
          node.test.operator === "!"
        ) {
          if (polyfilled.has(node.test.argument)) {
            path.replaceWith(node.alternate);
          }
        }
      },
    },
    // Symbol(), new Promise
    ReferencedIdentifier(path: NodePath<t.Identifier>) {
      const {
        node: { name },
        node,
        scope,
      } = path;
      if (scope.getBindingIdentifier(name)) return;

      callProvider({ kind: "global", name }, path);

      maybeMark(path, node);
    },

    MemberExpression(path: NodePath<t.MemberExpression>) {
      const key = resolveKey(path.get("property"), path.node.computed);
      if (!key || key === "prototype") return;

      const object = path.get("object");
      if (object.isIdentifier()) {
        const binding = object.scope.getBinding(object.node.name);
        if (binding && binding.path.isImportNamespaceSpecifier()) return;
      }

      const { node } = path;

      const source = resolveSource(object);
      property(source.id, key, source.placement, path);

      maybeMark(path, node);
    },

    ObjectPattern(path: NodePath<t.ObjectPattern>) {
      const { parentPath, parent } = path;
      let obj;

      // const { keys, values } = Object
      if (parentPath.isVariableDeclarator()) {
        obj = parentPath.get("init");
        // ({ keys, values } = Object)
      } else if (parentPath.isAssignmentExpression()) {
        obj = parentPath.get("right");
        // !function ({ keys, values }) {...} (Object)
        // resolution does not work after properties transform :-(
      } else if (parentPath.isFunction()) {
        const grand = parentPath.parentPath;
        if (grand.isCallExpression() || grand.isNewExpression()) {
          if (grand.node.callee === parent) {
            obj = grand.get("arguments")[path.key];
          }
        }
      }

      let id = null;
      let placement = null;
      if (obj) ({ id, placement } = resolveSource(obj));

      for (const prop of path.get("properties")) {
        if (prop.isObjectProperty()) {
          const key = resolveKey(prop.get("key"));
          if (key) property(id, key, placement, prop);
        }
      }
    },

    BinaryExpression(path: NodePath<t.BinaryExpression>) {
      if (path.node.operator !== "in") return;

      const source = resolveSource(path.get("right"));
      const key = resolveKey(path.get("left"), true);

      if (!key) return;

      callProvider(
        {
          kind: "in",
          object: source.id,
          key,
          placement: source.placement,
        },
        path,
      );
    },
  };
};
