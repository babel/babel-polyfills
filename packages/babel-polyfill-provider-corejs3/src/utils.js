// @flow

import { types as t } from "@babel/core";
import corejsEntries from "core-js-compat/entries";

export function callMethod(path: *, id: t.Identifier) {
  const { object } = path.node;

  let context1, context2;
  if (t.isIdentifier(object)) {
    context1 = object;
    context2 = t.cloneNode(object);
  } else {
    context1 = path.scope.generateDeclaredUidIdentifier("context");
    context2 = t.assignmentExpression("=", context1, object);
  }

  path.replaceWith(
    t.memberExpression(t.callExpression(id, [context2]), t.identifier("call")),
  );

  path.parentPath.unshiftContainer("arguments", context1);
}

export function isCoreJSSource(source: string) {
  if (typeof source === "string") {
    source = source
      .replace(/\\/g, "/")
      .replace(/(\/(index)?)?(\.js)?$/i, "")
      .toLowerCase();
  }

  return hasOwnProperty.call(corejsEntries, source) && corejsEntries[source];
}

export function coreJSModule(name: string) {
  return `core-js/modules/${name}`;
}
