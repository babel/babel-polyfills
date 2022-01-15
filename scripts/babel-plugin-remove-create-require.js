module.exports = function() {
  return {
    visitor: {
      VariableDeclarator(path) {
        if (
          path.get("id").isIdentifier({ name: "require" }) &&
          path.get("init").isCallExpression() &&
          path.get("init.callee").isIdentifier({ name: "createRequire" })
        ) {
          path.remove();
        }
      },
    },
  };
};
