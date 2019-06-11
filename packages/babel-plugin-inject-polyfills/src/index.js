// @flow

import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
import * as traverse from "@babel/traverse";
import { type NodePath } from "@babel/traverse";

import getTargets from "@babel/preset-env/lib/targets-parser";
import filterItems, {
  isPluginRequired,
} from "@babel/preset-env/lib/filter-items";

import {
  getImportSource,
  getRequireSource,
  resolveKey,
  resolveSource,
} from "./utils";
import { createProviderDescriptors } from "./config";

export { resolveProvider } from "./config";

export default declare((api, options) => {
  api.assertVersion(7);

  const {
    method,
    providers,
    targets: targetsOption,
    ignoreBrowserslistConfig,
    configPath,
  } = options;

  let methodName;
  if (method === "usage-global") methodName = "usageGlobal";
  else if (method === "entry-global") methodName = "entryGlobal";
  else if (method === "usage-pure") methodName = "usagePure";
  else if (typeof method !== "string") {
    throw new Error(".method must be a string");
  } else {
    throw new Error(
      `.method must be one of "entry-global", "usage-global"` +
        ` or "usage-pure" (received "${method}")`,
    );
  }

  if (!Array.isArray(providers) || providers.length === 0) {
    throw new Error(".providers must be an array with at least one element.");
  }

  const targets = getTargets(targetsOption, {
    ignoreBrowserslistConfig,
    configPath,
  });

  const providersDescriptors = createProviderDescriptors(providers);

  const resolvedProviders = providersDescriptors.map(
    ({ value, options = {}, alias }) => {
      const include = new Set(options.include || []);
      const exclude = new Set(options.exclude || []);

      const api = {
        getUtils,
        method,
        targets,
        include,
        exclude,
        filterPolyfills(polyfills, defaultInclude, defaultExclude) {
          return filterItems(
            polyfills,
            include,
            exclude,
            targets,
            defaultInclude,
            defaultExclude,
          );
        },
        isPolyfillRequired(support) {
          return isPluginRequired(targets, support);
        },
      };

      const provider = value(api, options);

      if (typeof provider[methodName] !== "function") {
        throw new Error(
          `The "${provider.name || alias}" provider doesn't ` +
            `support the "${method}" polyfilling method.`,
        );
      }

      return provider;
    },
  );

  const storage: WeakMap<NodePath, *> = new WeakMap();

  function getUtils(path) {
    const programPath = path.findParent(p => p.isProgram());
    if (!storage.has(programPath.node)) {
      storage.set(programPath.node, new Map());
    }

    // $FlowIgnore
    const imports = (storage.get(programPath.node): Map<*, *>);

    return {
      injectGlobalImport(url) {
        if (!imports.has(url)) imports.set(url, new Map());
      },
      injectNamedImport(url, name, hint = name) {
        this.injectGlobalImport(url);

        // $FlowIgnore
        const m = (imports.get(url): Map<*, *>);

        if (!m.has(name)) {
          m.set(name, programPath.scope.generateUid(hint));
        }

        return t.identifier(m.get(name));
      },
      injectDefaultImport(url, hint = url) {
        return this.injectNamedImport(url, "default", hint);
      },
    };
  }

  function callProviders(payload, path) {
    const utils = getUtils(path);

    resolvedProviders.every(provider => {
      provider[methodName](payload, utils, path);
      return !!path.node;
    });
  }

  function property(object, key, placement, path) {
    return callProviders({ kind: "property", object, key, placement }, path);
  }

  const visitor = {
    Program: {
      exit(path) {
        const imports = storage.get(path.node);
        if (!imports) return;

        const nodes = [];
        imports.forEach((ids, url) => {
          const specifiers = [];
          ids.forEach((local, imported) => {
            if (imported === "default") {
              // This needs to be the first specifier, otherwise @babel/generator has problems
              specifiers.unshift(t.importDefaultSpecifier(t.identifier(local)));
            } else {
              specifiers.push(
                t.importSpecifier(t.identifier(local), t.identifier(imported)),
              );
            }
          });
          nodes.push(t.importDeclaration(specifiers, t.stringLiteral(url)));
        });

        path.unshiftContainer("body", nodes);
      },
    },
  };

  const entryVisitor = {
    ImportDeclaration(path) {
      const source = getImportSource(path);
      if (!source) return;
      callProviders({ kind: "import", source }, path);
    },
    Program(path: NodePath) {
      path.get("body").forEach(bodyPath => {
        const source = getRequireSource(bodyPath);
        if (!source) return;
        callProviders({ kind: "import", source }, bodyPath);
      });
    },
  };

  const usageVisitor = {
    // Symbol(), new Promise
    ReferencedIdentifier(path: NodePath) {
      const {
        node: { name },
        scope,
      } = path;
      if (scope.getBindingIdentifier(name)) return;

      callProviders({ kind: "global", name }, path);
    },

    MemberExpression: {
      exit(path: NodePath) {
        const key = resolveKey(path.get("property"), path.node.computed);
        if (!key || key === "prototype") return;

        const source = resolveSource(path.get("object"));
        return property(source.id, key, source.placement, path);
      },
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
          property(id, key, placement, prop);
        }
      }
    },

    BinaryExpression(path: NodePath) {
      if (path.node.operator !== "in") return;

      const source = resolveSource(path.get("right"));
      const key = resolveKey(path.get("left"), true);

      callProviders(
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

  const visitors = [
    visitor,
    method === "entry-global" ? entryVisitor : usageVisitor,
  ];
  resolvedProviders.forEach(p => p.visitor && visitors.push(p.visitor));

  return {
    name: "inject-polyfills",
    visitor: traverse.visitors.merge(visitors),
  };
});
