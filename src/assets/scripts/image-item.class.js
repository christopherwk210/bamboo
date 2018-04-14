import { ipcRenderer } from 'electron';
import path from 'path';

const Status = {
  DONE: 'done',
  LOADING: 'loading',
  ERROR: 'error'
}

export class ImageItem {
  constructor(filePath) {
    this.id = '';
    this.status = Status.LOADING;
    this.path = filePath;
    this.fileName = path.basename(this.path);
  }

  beginUpload() {
    ipcRenderer.send('uploadImage', {
      id: this.id,
      path: this.path
    });
  }
}
