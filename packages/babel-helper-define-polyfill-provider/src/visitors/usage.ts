import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";
import type { CallProvider } from "./index";

import { resolveKey, resolveSource } from "../utils";

function isRemoved(path: NodePath) {
  if (path.removed) return true;
  if (!path.parentPath) return false;
  if (path.listKey) {
    if (!path.parentPath.node?.[path.listKey]?.includes(path.node)) return true;
  } else {
    if (path.parentPath.node[path.key] !== path.node) return true;
  }
  return isRemoved(path.parentPath);
}

export default (callProvider: CallProvider) => {
  function property(object, key, placement, path) {
    return callProvider({ kind: "property", object, key, placement }, path);
  }

  function handleReferencedIdentifier(path) {
    const {
      node: { name },
      scope,
    } = path;
    if (scope.getBindingIdentifier(name)) return;

    callProvider({ kind: "global", name }, path);
  }

  function analyzeMemberExpression(
    path: NodePath<t.MemberExpression | t.OptionalMemberExpression>,
  ) {
    const key = resolveKey(path.get("property"), path.node.computed);
    return { key, handleAsMemberExpression: !!key && key !== "prototype" };
  }

  return {
    // Symbol(), new Promise
    ReferencedIdentifier(path: NodePath<t.Identifier>) {
      const { parentPath } = path;
      if (
        parentPath.isMemberExpression({ object: path.node }) &&
        analyzeMemberExpression(parentPath).handleAsMemberExpression
      ) {
        return;
      }
      handleReferencedIdentifier(path);
    },

    "MemberExpression|OptionalMemberExpression"(
      path: NodePath<t.MemberExpression | t.OptionalMemberExpression>,
    ) {
      const { key, handleAsMemberExpression } = analyzeMemberExpression(path);
      if (!handleAsMemberExpression) return;

      const object = path.get("object");
      let objectIsGlobalIdentifier = object.isIdentifier();
      if (objectIsGlobalIdentifier) {
        const binding = object.scope.getBinding(
          (object.node as t.Identifier).name,
        );
        if (binding) {
          if (binding.path.isImportNamespaceSpecifier()) return;
          objectIsGlobalIdentifier = false;
        }
      }

      const source = resolveSource(object);
      let skipObject = property(source.id, key, source.placement, path);
      skipObject ||=
        !objectIsGlobalIdentifier ||
        path.shouldSkip ||
        object.shouldSkip ||
        isRemoved(object);

      if (!skipObject) handleReferencedIdentifier(object);
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
