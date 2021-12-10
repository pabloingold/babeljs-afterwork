const babel = require('@babel/core');
const myCustomPlugin = require('./myCustomPlugin.js');
const fs = require('fs');
const source = fs.readFileSync('script.js', 'utf8');

const output = babel.transformSync(source, {
  plugins: [
    myCustomPlugin,
  ],
});

fs.writeFileSync('script-compiled.js', output.code); // 'const x = 1;'

// npm run babelTransform
