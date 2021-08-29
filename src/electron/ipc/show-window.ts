import { IPCObject } from './ipc.interface';
import { BrowserWindow } from 'electron';

export const showWindow: IPCObject = {
  channel: 'show-window',
  handler: event => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    window.show();
  }
};
