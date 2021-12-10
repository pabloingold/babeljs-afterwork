const path = require('path');
const fse = require('fs-extra');
const { parse, print } = require('recast');
const traverse = require('@babel/traverse').default;
const { parseSync } = require('@babel/core');
const t = require('@babel/types');

const removeAppAliases = filePaths => {

    filePaths.forEach(filePath => {
        const source = fse.readFileSync(filePath, 'utf8');
        const ast = parse(source, {
            parser: {
                parse: (source) =>
                    parseSync(source, {
                        sourceType: 'unambiguous',
                        filename: filePath,
                        parserOpts: {
                            tokens: true,
                        },
                    }),
            },
        });

        traverse(ast, {
            StringLiteral(path) {
                if (
                  path.node.value.startsWith('<svg') &&
                  path.findParent((path) => path.isTemplateLiteral()) &&
                  path.findParent((path) => path.isTemplateLiteral()).findParent((path) => path.isTaggedTemplateExpression()).node.tag.name === 'html'
                ) {
                  const svgLiteral = t.templateLiteral([t.templateElement({cooked:path.node.value, raw:path.node.value}, false)], []);
                  const taggedTmplt = t.taggedTemplateExpression(t.identifier('tag'), svgLiteral);
                  path.replaceWith(t.arrowFunctionExpression([t.identifier('tag')], taggedTmplt));
                };
              }
        });

        const output = filePath.replace('src', 'outputSrc');
        fse.ensureFileSync(output);
        fse.writeFileSync(output, print(ast, { quote: 'single', useTabs: false, lineTerminator: '\n' }).code);
    });
};

module.exports = removeAppAliases;
