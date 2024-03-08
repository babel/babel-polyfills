import type { NodePath } from "@babel/traverse";
import { types as t } from "@babel/core";
import type { CallProvider } from "./index";

import { getImportSource, getRequireSource } from "../utils";

export default (callProvider: CallProvider) => ({
  ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
    const source = getImportSource(path);
    if (!source) return;
    callProvider({ kind: "import", source }, path);
  },
  Program(path: NodePath<t.Program>) {
    path.get("body").forEach(bodyPath => {
      const source = getRequireSource(bodyPath);
      if (!source) return;
      callProvider({ kind: "import", source }, bodyPath);
    });
  },
});
