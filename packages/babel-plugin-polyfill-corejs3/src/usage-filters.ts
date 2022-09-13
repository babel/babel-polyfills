import type { CoreJSPolyfillDescriptor } from "./built-in-definitions";
import { types as t, type NodePath } from "@babel/core";

export default function canSkipPolyfill(
  desc: CoreJSPolyfillDescriptor,
  path: NodePath,
) {
  const { node, parent } = path;
  switch (desc.name) {
    case "es.string.split": {
      if (!t.isCallExpression(parent, { callee: node })) return false;
      if (parent.arguments.length < 1) return true;
      const splitter = parent.arguments[0];
      return t.isStringLiteral(splitter) || t.isTemplateLiteral(splitter);
    }
  }
}
