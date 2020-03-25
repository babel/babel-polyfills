import { types as t } from "@babel/core";
import generator from "@babel/generator";

export default {
  test: v => t.isNode(v),
  print(ast) {
    return generator(ast).code;
  },
};
