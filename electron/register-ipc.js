// Lib imports
const { app, dialog, ipcMain, shell } = require('electron');
const tinify = require('tinify');
const fs = require('fs');
const util = require('util');
const settings = require('electron-settings');

// Get package
const package = require('./package.json');

// Async
const readFile = util.promisify(fs.readFile);
const rename = util.promisify(fs.rename);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

/**
 * Registers all ipc listeners
 * @param {Electron.BrowserWindow} mainWindow Window to show dialogs under
 */
function registerIpcListeners(mainWindow) {

  // Manual image adding
  ipcMain.on('loadFile', e => {
    dialog.showOpenDialog(mainWindow, {
      title: 'Bamboo - Add Images',
      defaultPath: app.getPath('documents'),
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }
      ],
      properties: [
        'openFile', 'multiSelections'
      ]
    }, async paths => {
      if (!paths) return;
      
      let files = [];

      // Get file sizes
      for (let fPath of paths) {
        let fileSize = await stat(fPath).size;
        files.push({
          path: fPath,
          size: fileSize
        });
      }

      // Send files
      e.sender.send('filesSelected', files);
    });
  });

  // Show the about message with proper app version
  ipcMain.on('showAbout', e => {
    let result = dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: [
        'Dismiss',
        'View Source'
      ],
      cancelId: 0,
      defaultId: 0,
      title: 'Bamboo - About',
      message: `Bamboo v${package.version}\nCreated by Chris Anselmo`,
      detail: 'Bamboo is not affiliated with nor endorsed by Tinify/TinyPNG/TinyJPG.'
    });

    if (result === 1) {
      shell.openExternal('https://github.com/christopherwk210/bamboo', e => {});
    }
  });

  // Uploading image to tinify API
  ipcMain.on('uploadImage', async (e, args) => {
    // Get API key
    tinify.key = settings.get('api-key') || '';

    let sourceData;

    // Read image into buffer
    try {
      sourceData = await readFile(args.path);
    } catch(e) {
      e.sender.send('imageError', {
        id: args.id,
        msg: 'Could not read file!'
      });
      return;
    }

    // Tinify
    tinify.fromBuffer(sourceData).toBuffer(async (err, res) => {
      let currentCompressionCount = tinify.compressionCount;

      if (err) {
        e.sender.send('imageError', {
          id: args.id,
          msg: err,
          currentCompressionCount
        });
      } else {
        // On success
        try {
          // Rename original file
          await rename(args.path, args.path + '.original');

          // Save buffer to original name
          await writeFile(args.path, res);

          // Get new filesize
          let newSize = await stat(args.path);

          // Move original file to trash
          let moveToTrashSuccess = shell.moveItemToTrash(args.path + '.original');

          // Send finished signal
          e.sender.send('imageComplete', {
            id: args.id,
            movedToTrash: moveToTrashSuccess,
            currentCompressionCount,
            newSize
          });
        } catch(e) {
          console.error(e);
          e.sender.send('imageError', {
            id: args.id,
            msg: e,
            currentCompressionCount
          });
        }
      }
    });
  });
}

module.exports = registerIpcListeners;
