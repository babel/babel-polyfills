// @flow

import * as babel from "@babel/core";
const { types: t } = babel.default || babel;
import corejsEntries from "../core-js-compat/entries.js";

export function callMethod(path: *, id: t.Identifier) {
  const { object } = path.node;

  let context1, context2;
  if (t.isIdentifier(object)) {
    context1 = object;
    context2 = t.cloneNode(object);
  } else {
    context1 = path.scope.generateDeclaredUidIdentifier("context");
    context2 = t.assignmentExpression("=", t.cloneNode(context1), object);
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
  return `core-js/modules/${name}.js`;
}

export function coreJSPureHelper(
  name: string,
  useBabelRuntime: string,
  ext: string,
) {
  return useBabelRuntime
    ? `${useBabelRuntime}/core-js/${name}${ext}`
    : `core-js-pure/features/${name}.js`;
}
