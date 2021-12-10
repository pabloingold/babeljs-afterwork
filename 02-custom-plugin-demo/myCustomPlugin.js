myCustomPlugin = () => ({
    visitor: {
        Identifier(path) {
            // in this example change all the variable `n` to `x`
            if (path.isIdentifier({ name: 'n' })) {
                path.node.name = 'x';
            }
        },
    },
  });

  module.exports = myCustomPlugin;