// Imports
const Parcel = require('parcel-bundler');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Aysncify
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);

// Parcel entry file
const entry = path.join(__dirname, '../src/index.html');

// Root directory
const root = path.join(__dirname, '../');

async function build() {
  console.log('Cleaning files...');

  // Clean existing assets
  const cleanupTypes = ['.html', '.js', '.css', '.map', '.png', '.ico'];  
  let files = await readdir(root);
  for (let file of files) {
    let fileStat = await stat( path.join(root, file) );

    if (fileStat.isFile && ~cleanupTypes.indexOf( path.extname(file) )) {
      try {
        await unlink(path.join(root, file));
        console.log(`Cleaned ${file}`);
      } catch(e) {
        console.warn(`Could not clean ${file}: ${e}`);
      }
    }
  }

  console.log('Done.');
  console.log('Building...');

  // Bundler options
  const options = {
    outDir: './',
    publicUrl: './',
    minify: true,
    watch: false
  };

  // Initialize bundler
  const bundler = new Parcel(entry, options);

  bundler.on('buildEnd', () => {
    console.log('Done.');
  });

  // Attempt to build
  try {
    await bundler.bundle();
  } catch(e) {
    console.error(e);
    process.exit();
  }
}

build();
