const path = require('path');
const fse = require('fs-extra');
const { parse, print } = require('recast');
const traverse = require('@babel/traverse').default;
const { parseSync } = require('@babel/core');
const t = require('@babel/types');

const pathToRelative = (importPath, filePath, currentAppPath) => {
    importPath = importPath.replace('!app/', '');
    const currentPathFolder = path.dirname(filePath);
    const relativePathToFile = path.relative(currentPathFolder, path.resolve(currentAppPath, importPath));
    return `${relativePathToFile.startsWith('.') ? '' : './'}${relativePathToFile.replace(/\\/g, '/')}`;
};

const removeAppAliases = filePaths => {

    filePaths.forEach(filePath => {
        const pathParts = filePath.replace(/\\/g, '/').split('/');
        const currentAppPath = path.resolve(pathParts.slice(0, pathParts.indexOf('src') + 1).join('/'));
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
            StringLiteral: function(currentPath) {
                if (
                      currentPath.node.value.startsWith('!app/') &&
                      currentPath.findParent((path) => path.isImportDeclaration())
                ) {
                    currentPath.replaceWith(t.stringLiteral(pathToRelative(currentPath.node.value, filePath, currentAppPath)));
                }
            },
        });

        const output = filePath.replace('app', 'outputApp');
        fse.ensureFileSync(output);
        fse.writeFileSync(output, print(ast, { quote: 'single', useTabs: false, lineTerminator: '\n' }).code);
    });
};

module.exports = removeAppAliases;
