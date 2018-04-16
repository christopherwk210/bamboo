// Lib imports
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

// Local imports
const registerIpcListeners = require('./register-ipc');

// Main window reference
let mainWindow;

// Environment var
let env = process.env.NODE_ENV || 'production';

/**
 * Creates the main browser window, called on ready
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: true,
    maximizable: false,
    center: true,
    fullscreenable: false,
    maxWidth: 1024,
    minHeight: 500,
    minWidth: 600,
    show: false
  });

  // Load url depends on environment
  let urls = {};
  urls.prod = url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  });
  urls.dev = 'http://localhost:1234/';
  mainWindow.loadURL(env === 'development' ? urls.dev : urls.prod);

  // Open dev tools when needed
  if (env === 'development') mainWindow.webContents.openDevTools();

  // Close app on main window exit
  mainWindow.on('closed', () => {
    app.quit();
  });

  registerIpcListeners(mainWindow);
}

function ready() {
  if (process.platform === 'darwin') {
    let template = [
      { 
        label: app.getName(), 
        submenu: [
          { role: 'quit' }
        ] 
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { type: 'separator' },
          { role: 'selectall' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { type: 'separator' },
          { role: 'front' }
        ]
      }
    ];

    Menu.setApplicationMenu( Menu.buildFromTemplate(template) );
  } else {
    Menu.setApplicationMenu(null);
  }

  createWindow();  
}

app.on('ready', ready);

// Close app on all closed, in case it isn't closed already
app.on('window-all-closed', () => {
  app.quit();
});
