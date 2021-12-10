const path = require('path');
const globule = require('globule');
const breakingChange = require('./codemods/codemod.breaking.change');

const filePaths = globule.find(`src/**/*.js`).map(filePath => path.resolve(filePath));
console.log('filePaths ', filePaths);

const runMigration = () => {
  try {
    breakingChange(filePaths);
  } catch (err) {
    console.error(err);
  }
};

runMigration();
// npm run codemod