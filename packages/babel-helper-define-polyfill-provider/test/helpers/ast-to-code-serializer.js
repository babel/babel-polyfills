import { types as t } from "@babel/core";
import _generator from "@babel/generator";
// For compatibility when running tests with Babel 7
const generator = _generator.default || _generator;

export default {
  test: v => t.isNode(v),
  print(ast) {
    return generator(ast).code;
  },
};
