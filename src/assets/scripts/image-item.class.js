import path from 'path';

const Status = {
  DONE: 'done',
  LOADING: 'loading',
  ERROR: 'error'
}

export class ImageItem {
  constructor(filePath) {
    this.status = Status.LOADING;
    this.path = filePath;
    this.fileName = path.basename(this.path);
  }
}
