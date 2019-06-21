module.exports = string => () => {
  return {
    name: "test",
    entryGlobal() {},

    visitor: {
      Program(path) {
        path.node.body = [
          {
            type: "ExpressionStatement",
            expression: { type: "StringLiteral", value: string },
          },
        ];
        path.stop();
      },
    },
  };
};
