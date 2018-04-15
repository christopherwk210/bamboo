// Packages that are required by the renderer process
const requiredDependencies = [
  'electron-settings',
  'feather-icons',
  'tinify',
  'vue'
];

// Imports
const path = require('path');
const fs = require('fs');
const util = require('util');
const package = require('../package.json');

// Async
const exists = util.promisify(fs.exists);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

const destinationPath = path.join(__dirname, '../electron/package.json');

let electronPackage = {
  main: 'electron.js',
  version: package.version,
  dependencies: {}
};

// Apply dependencies
requiredDependencies.forEach(dep => {
  electronPackage.dependencies[dep] = package.dependencies[dep];
});

(async () => {
  let fileExists = await exists(destinationPath);

  if (fileExists) {
    await unlink(destinationPath);
  }

  await writeFile(destinationPath, JSON.stringify(electronPackage), { encoding: 'utf8' });
})();
