import path from 'path';

export class ImageItem {
  constructor(filePath) {
    this.status = 'loading';
    this.path = filePath;
    this.fileName = path.basename(this.path);
  }
}
