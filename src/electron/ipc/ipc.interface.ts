export interface IPCObject {
  channel: string;
  handler: (event: Electron.IpcMainEvent, ...args: any[]) => void;
}
