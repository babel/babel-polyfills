// @flow

import { types as t } from "@babel/core";

export const has = (o: Object, k: string): boolean =>
  Object.hasOwnProperty.call(o, k);

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
