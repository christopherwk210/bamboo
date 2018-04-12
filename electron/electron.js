// Imports
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const url = require('url');

const package = require('./package.json');

let mainWindow;
let env = ~process.argv.indexOf('--dev') ? 'dev' : 'prod';

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: true,
    maximizable: false,
    center: true,
    fullscreenable: false,
    maxWidth: 1024,
    minHeight: 500,
    minWidth: 600
  });

  // Load url depends on environment
  let urls = {};
  urls.prod = url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  });
  urls.dev = 'http://localhost:1234/';

  mainWindow.loadURL(env === 'dev' ? urls.dev : urls.prod);

  // if (env === 'dev') {
    mainWindow.webContents.openDevTools();
  // }

  mainWindow.on('closed', () => {
    app.quit();
  });

  registerIpcListeners();
}

function registerIpcListeners() {
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
      detail: 'Bamboo is not affiliated with Tinify, TinyPNG, or TinyJPG'
    });

    if (result === 1) {
      shell.openExternal('https://www.github.com/', e => {});
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
