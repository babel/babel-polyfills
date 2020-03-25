// @flow

import type { NodePath } from "@babel/traverse";
import type { MetaDescriptor } from "../types";

import { getImportSource, getRequireSource } from "../utils";

export default (
  callProvider: (payload: MetaDescriptor, path: NodePath) => void,
) => ({
  ImportDeclaration(path: NodePath) {
    const source = getImportSource(path);
    if (!source) return;
    callProvider({ kind: "import", source }, path);
  },
  Program(path: NodePath) {
    path.get("body").forEach(bodyPath => {
      const source = getRequireSource(bodyPath);
      if (!source) return;
      callProvider({ kind: "import", source }, bodyPath);
    });
  },
});
