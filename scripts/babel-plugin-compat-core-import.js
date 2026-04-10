// Convert
//   import foo, { x as y } from "@babel/core";
// to
//   import * as _babel_core from "@babel/core";
//   const { default: foo, x: y } = _babel_core.default && _babel_core.default.__esModule ? _babel_core.default : _babel_core;

module.exports = function ({ types: t, template }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        if (
          !source.startsWith("@babel/") ||
          source === "@babel/helper-define-polyfill-provider"
        ) {
          return;
        }

        if (path.node.importKind === "type") return;
        const specs = path.node.specifiers.filter(s => s.importKind !== "type");
        if (specs.length === 0) return;

        const hasDefault = specs.some(s => t.isImportDefaultSpecifier(s));
        const namedSpecs = specs.filter(s => t.isImportSpecifier(s));

        if (!hasDefault && namedSpecs.length === 0) return;

        const nsName = path.scope.generateUidIdentifier(source);

        // Use __esModule to distinguish CJS (Babel 7) from ESM (Babel 8).
        // Cannot use the simpler `_ns.default || _ns` because for ESM
        // packages that have a default export (like
        // @babel/helper-compilation-targets), `_ns.default` is truthy.

        const properties = namedSpecs.map(spec =>
          t.objectProperty(spec.imported, spec.local)
        );
        if (hasDefault) {
          // Treat default import as `{ default: local }`
          const defaultSpec = specs.find(s => t.isImportDefaultSpecifier(s));
          properties.unshift(
            t.objectProperty(t.identifier("default"), defaultSpec.local)
          );
        }

        const destr = t.objectPattern(properties);

        path.replaceWithMultiple([
          template.statement.ast`import * as ${nsName} from "${source}";`,
          template.statement
            .ast`const ${destr} = ${nsName}.default && ${nsName}.default.__esModule ? ${nsName}.default : ${nsName};`,
        ]);
      },
    },
  };
};
