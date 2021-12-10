const path = require('path');
const globule = require('globule');
const removeAppAliases = require('./codemods/codemod.remove.app.aliases');

const filePaths = globule.find(`app/src/**/*.js`).map(filePath => path.resolve(filePath));
console.log('filePaths ', filePaths);

const runMigration = () => {
  try {
    removeAppAliases(filePaths);
  } catch (err) {
    console.error(err);
  }
};

runMigration();
// npm run codemod