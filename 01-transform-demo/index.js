const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const fs = require('fs');
const source = fs.readFileSync('script.js', 'utf8');

// parse the code -> ast
const ast = parser.parse(source);

// transform the ast
traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: 'n' })) {
      path.node.name = 'x';
    }
  },
});

// generate code <- ast
const output = generate(ast, source);
fs.writeFileSync('script-compiled.js', output.code); // 'const x = 1;'

// npm run babelTransform
