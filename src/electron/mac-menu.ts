import { app, Menu } from 'electron';

const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
  {
    label: app.getName(), 
    submenu: [
      { role: 'quit' }
    ] 
  },
  { role: 'editMenu' },
  { role: 'windowMenu' }
];

export const macMenu = Menu.buildFromTemplate(template);
