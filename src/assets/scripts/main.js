import { webFrame, ipcRenderer, shell, remote } from 'electron';
process.env.NODE_ENV = remote.process.env.NODE_ENV || 'production';

// Import the correct version of Vue
let Vue;
if (process.env.NODE_ENV === 'production') {
  Vue = require('vue/dist/vue.min');
} else {
  Vue = require('vue/dist/vue');
}

import feather from 'feather-icons';

import { ImageItem } from './image-item.class';
import settings from 'electron-settings';

// Prevent zooming on mac
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

// Apply icons
feather.replace();

// Create Vue app
let app = new Vue({
  el: '#app',
  data: {
    imageList: [],
    apiKey: '',
    apiInputValue: ''
  },
  methods: {
    loadImages: function() {
      ipcRenderer.send('loadFile');
    },
    addImage: function(path) {
      let img = new ImageItem(path);
      this.imageList.push(img);
    },
    showAbout: () => ipcRenderer.send('showAbout'),
    showApiPage: () => shell.openExternal('https://tinypng.com/developers', e => {})
  }
});

// Register ipc callbacks
ipcRenderer.on('filesSelected', (e, args) => {
  if (args) {
    args.forEach(path => app.addImage(path));
  }
});

function addImageListItem() {
  app.imageList.push({ fileName: 'test', status: 'done' });
  app.imageList.push({ fileName: 'test', status: 'loading' });
  app.imageList.push({ fileName: 'test', status: 'error' });
}

window.addI = addImageListItem;
