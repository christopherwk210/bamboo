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
    }, paths => {
      e.sender.send('filesSelected', paths);
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
      detail: 'Bamboo is not affiliated with or endorsed by Tinify/TinyPNG/TinyJPG.'
    });

    if (result === 1) {
      shell.openExternal('https://www.github.com/', e => {});
    }
  });

  // Uploading image to tinify API
  ipcMain.on('uploadImage', async (e, args) => {
    tinify.key = settings.get('api-key') || '';

    let sourceData;

    try {
      sourceData = await readFile(args.path);
    } catch(e) {
      e.sender.send('imageError', {
        id: args.id,
        msg: 'Could not read file!'
      });
      return;
    }

    tinify.fromBuffer(sourceData).toBuffer((err, res) => {
      if (err) {
        e.sender.send('imageError', {
          id: args.id,
          msg: err
        });
      } else {
        // Rename original
        // Save buffer as same name as original
        // Delete original with electron (by sending to recycle bin)
        // Send the finished signal
      }
    });
  });
}

module.exports = registerIpcListeners;
