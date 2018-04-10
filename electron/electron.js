const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;
let env = ~process.argv.indexOf('--dev') ? 'dev' : 'prod';

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    resizable: false,
    maximizable: false,
    center: true,
    fullscreenable: false
  });

  let urls = {};
  urls.prod = url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  });
  urls.dev = 'http://localhost:1234/'

  mainWindow.loadURL(env === 'dev' ? urls.dev : urls.prod);

  if (env === 'dev') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
