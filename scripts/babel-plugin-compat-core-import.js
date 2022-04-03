// Convert
//   import { x as y } from "@babel/core";
// to
//   import * as babel from "@babel/core";
//   const { x: y } = babel.default || babel;

module.exports = function ({ types: t, template }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (
          t.isStringLiteral(path.node.source, { value: "@babel/core" }) &&
          path.node.specifiers.every(node => t.isImportSpecifier(node))
        ) {
          const defaultName = path.scope.generateUidIdentifier("babel");

          const destr = t.objectPattern(
            path.node.specifiers.map(spec =>
              t.objectProperty(spec.imported, spec.local)
            )
          );

          path.replaceWithMultiple(template.statements.ast`
            import * as ${defaultName} from "@babel/core";
            const ${destr} = ${defaultName}.default || ${defaultName};
          `);
        }
      },
    },
  };
};
