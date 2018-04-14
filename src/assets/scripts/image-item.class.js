import { ipcRenderer } from 'electron';
import path from 'path';

const Status = {
  DONE: 'done',
  LOADING: 'loading',
  ERROR: 'error'
}

export class ImageItem {
  constructor(filePath, fileSize) {
    this.id = this.guid();
    this.status = Status.LOADING;
    this.path = filePath;
    this.size = fileSize;
    this.completedSize = null;
    this.errorMessage = null;
    this.fileName = path.basename(this.path);
  }

  markAsComplete(finishedSize) {
    this.completedSize = finishedSize;
    this.status = Status.DONE;
  }

  markAsError(message) {
    this.errorMessage = message;
    this.status = Status.ERROR;
  }

  beginUpload() {
    ipcRenderer.send('uploadImage', {
      id: this.id,
      path: this.path
    });
  }

  /**
   * Generate random UUID
   * Source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   */
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
