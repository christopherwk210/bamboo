// Imports
const path = require('path');
const fs = require('fs');
const util = require('util');
const rimraf = require('rimraf');

const exists = util.promisify(fs.exists);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);

const tmpDirectory = path.join(__dirname, '../tmp');
const distDirectory = path.join(__dirname, '../electron/dist');
const etcDirectory = path.join(__dirname, '../electron/etc');
const nodeModulesDirectory = path.join(__dirname, '../electron/node_modules');

const packageLockDirectory = path.join(__dirname, '../electron/package-lock.json');

let cleanDirectories = [
  distDirectory,
  etcDirectory,
  nodeModulesDirectory
];

(async () => {
  for(let dir of cleanDirectories) {
    if (await exists(dir)) {
      await new Promise(res => {
        rimraf(dir, e => {
          if (e) throw e;
          res();
        });
      });
    }
  }

  if (await exists(packageLockDirectory)) {
    await unlink(packageLockDirectory);
  }
})();
