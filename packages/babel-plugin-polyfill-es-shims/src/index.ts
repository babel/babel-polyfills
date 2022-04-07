import defineProvider, {
  type Utils,
  type MetaDescriptor,
} from "@babel/helper-define-polyfill-provider";
import type { NodePath } from "@babel/traverse";

import polyfills from "../data/polyfills.js";

import {
  type Descriptor,
  Globals,
  StaticProperties,
  InstanceProperties,
} from "./mappings";

export default defineProvider<{}>(function ({
  shouldInjectPolyfill,
  assertDependency,
  createMetaResolver,
  debug,
  babel: { template, types: t },
}) {
  const expr = template.expression.ast;

  const resolvePolyfill = createMetaResolver<Descriptor[]>({
    global: Globals,
    static: StaticProperties,
    instance: InstanceProperties,
  });

  function createDescIterator(
    cb: (desc: Descriptor, utils: Utils, path: NodePath) => void,
    instance?: (
      meta: MetaDescriptor,
      resolved: any,
      utils: Utils,
      path: any,
    ) => void,
  ) {
    return (meta: MetaDescriptor, utils: Utils, path: NodePath) => {
      if (path.parentPath.isUnaryExpression({ operator: "delete" })) return;

      const resolved = resolvePolyfill(meta);
      if (!resolved) return;

      if (instance && resolved.kind === "instance") {
        instance(meta, resolved, utils, path);
        return;
      }

      for (const desc of resolved.desc) {
        if (!desc.exclude?.(meta, path) && shouldInjectPolyfill(desc.name)) {
          cb(desc, utils, path);

          // Since global and static polyfills are unambiguous, we only need to
          // inject the first non-excluded one.
          if (resolved.kind !== "instance") {
            break;
          }
        }
      }
    };
  }

  function injectDefault(desc, utils) {
    assertDependency(desc.package, desc.version);
    debug(desc.name);

    return utils.injectDefaultImport(desc.path, desc.nameHint || desc.name);
  }

  const seen = new WeakSet();

  return {
    name: "es-shims",
    polyfills,

    usageGlobal: createDescIterator((desc, utils) => {
      if (desc.global === false) return;

      assertDependency(desc.package, desc.version);

      utils.injectGlobalImport(`${desc.path}/auto`);

      debug(desc.name);
    }),

    usagePure: createDescIterator(
      (desc, utils, path) => {
        path.replaceWith(injectDefault(desc, utils));
      },
      (meta, resolved, utils, path) => {
        if (meta.kind !== "property") return;
        if (path.parentPath.isAssignmentExpression({ left: path.node })) return;

        if (seen.has(path.node)) return;
        seen.add(path.node);

        const isCall = path.parentPath.isCallExpression({ callee: path.node });
        const isGetter = resolved.desc[0].getter;

        const matchesPolyfill = ({ name }) =>
          name.startsWith(meta.object as any as string);

        let index = -1;
        if (
          // This is the actual method for sure.
          meta.kind === "property" &&
          meta.placement === "prototype" &&
          meta.object != null &&
          (index = resolved.desc.findIndex(matchesPolyfill)) !== -1
        ) {
          const desc = resolved.desc[index];
          if (!shouldInjectPolyfill(desc.name)) return;

          const id = injectDefault(desc, utils);

          if (isGetter) {
            path.replaceWith(expr`${id}(${path.node.object})`);
          } else if (isCall) {
            path.parentPath.unshiftContainer("arguments", path.node.object);
            path.replaceWith(id);
          } else if (
            path.parentPath.isMemberExpression({
              object: path.node,
              computed: false,
            }) &&
            path.parent.property.name === "call" &&
            path.parentPath.parentPath.isCallExpression({ callee: path.parent })
          ) {
            path.parentPath.replaceWith(id);
          } else {
            path.replaceWith(expr`${id}.getPolyfill()`);
          }
        } else {
          let tmp;
          let parent;
          let replacement = path.node;
          const { object } = path.node;

          for (const desc of resolved.desc) {
            const { thisCheck } = desc;
            if (
              !thisCheck ||
              desc.exclude?.(meta) ||
              !shouldInjectPolyfill(desc.name)
            ) {
              continue;
            }

            if (!tmp) {
              tmp = path.scope.generateUidIdentifierBasedOnNode(object);
              path.scope.push({ id: t.cloneNode(tmp) });
              path.get("object").replaceWith(tmp);
            }

            const id = injectDefault(desc, utils);

            replacement = t.conditionalExpression(
              thisCheck(t.cloneNode(tmp)),
              isGetter
                ? expr`${id}(${t.cloneNode(tmp)})`
                : isCall
                ? id
                : expr`${id}.getPolyfill()`,
              replacement,
            );

            parent = parent ?? replacement;
          }

          if (!parent) return;

          replacement = expr`(${t.cloneNode(tmp)} = ${object}, ${replacement})`;

          if (!isGetter && isCall) {
            parent.alternate = expr`Function.call.bind(${parent.alternate})`;
            path.parentPath.unshiftContainer("arguments", t.cloneNode(tmp));
          }

          path.replaceWith(replacement);
        }
      },
    ),
  };
});
