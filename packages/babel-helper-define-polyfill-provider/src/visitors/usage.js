// @flow

import type { NodePath } from "@babel/traverse";
import type { MetaDescriptor } from "../types";

import { resolveKey, resolveSource } from "../utils";

export default (
  callProvider: (payload: MetaDescriptor, path: NodePath) => void,
) => {
  function property(object, key, placement, path) {
    return callProvider({ kind: "property", object, key, placement }, path);
  }

  return {
    // Symbol(), new Promise
    ReferencedIdentifier(path: NodePath) {
      if (
        path.parentPath.isExportSpecifier() &&
        path.parentPath.parent.source
      ) {
        // export { Foo } from "module"
        return;
      }

      const {
        node: { name },
        scope,
      } = path;
      if (scope.getBindingIdentifier(name)) return;

      callProvider({ kind: "global", name }, path);
    },

    MemberExpression(path: NodePath) {
      const key = resolveKey(path.get("property"), path.node.computed);
      if (!key || key === "prototype") return;

      const object = path.get("object");
      const binding = object.scope.getBinding(object.node.name);
      if (binding && binding.path.isImportNamespaceSpecifier()) return;

      const source = resolveSource(object);
      return property(source.id, key, source.placement, path);
    },

    ObjectPattern(path: NodePath) {
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

    BinaryExpression(path: NodePath) {
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
