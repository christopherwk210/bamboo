import { ipcRenderer } from 'electron';

class ElectronRenderer {
  private ipcRenderer: typeof ipcRenderer;

  constructor() {
    this.ipcRenderer = (window as any).ipcRenderer;
  }

  showWindow() {
    this.ipcRenderer.send('show-window');
  }
}

export const electronRenderer = new ElectronRenderer();
