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

        let modified = false;
        traverse(ast, {
            StringLiteral(currentPath) {
                if (
                    currentPath.node.value.startsWith('<svg') &&
                    currentPath.findParent((currentPath) => currentPath.isTemplateLiteral()) &&
                    currentPath.findParent((currentPath) => currentPath.isTemplateLiteral()).findParent((currentPath) => currentPath.isTaggedTemplateExpression()).node.tag.name === 'html'
                ) {
                  const svgLiteral = t.templateLiteral([t.templateElement({cooked:currentPath.node.value, raw:currentPath.node.value}, false)], []);
                  const taggedTmplt = t.taggedTemplateExpression(t.identifier('tag'), svgLiteral);
                  currentPath.replaceWith(t.arrowFunctionExpression([t.identifier('tag')], taggedTmplt));
                  modified = true;
                };
              }
        });

        if(modified) {
            fse.writeFileSync(filePath, print(ast, { quote: 'single', useTabs: false, lineTerminator: '\n' }).code);
            modified = false;
        }
    });
};

module.exports = removeAppAliases;
